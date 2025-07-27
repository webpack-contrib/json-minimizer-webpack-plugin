const { validate } = require("schema-utils");

const { minify: internalMinify } = require("./minify");
const schema = require("./options.json");

/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").Asset} Asset */
/** @typedef {import("webpack").WebpackError} WebpackError */

/** @typedef {RegExp | string} Rule */
/** @typedef {Rule[] | Rule} Rules */

/**
 * @typedef {object} JSONOptions
 * @property {(this: unknown, key: string, value: unknown) => unknown | (number | string)[] | null=} replacer JSON replacer function or array
 * @property {string | number=} space JSON space parameter for formatting
 */

/**
 * @typedef {object} BasePluginOptions
 * @property {Rule=} test Test pattern for matching files
 * @property {Rule=} include Include pattern for files
 * @property {Rule=} exclude Exclude pattern for files
 * @property {JSONOptions=} minimizerOptions Options for JSON minimization
 */

/**
 * @typedef {object} MinimizedResult
 * @property {string} code The minimized JSON code
 */

/**
 * @typedef {object} InternalOptions
 * @property {string} input The input JSON string to minimize
 * @property {JSONOptions=} minimizerOptions Options for JSON minimization
 */

/**
 * @typedef {BasePluginOptions} PluginOptions
 */

class JsonMinimizerPlugin {
  /**
   * Create a new JsonMinimizerPlugin instance
   * @param {PluginOptions} options Plugin configuration options
   */
  constructor(options = {}) {
    validate(/** @type {Schema} */ (schema), options, {
      name: "Json Minimizer Plugin",
      baseDataPath: "options",
    });

    const {
      minimizerOptions = {},
      test = /\.json(\?.*)?$/i,
      include,
      exclude,
    } = options;

    /**
     * @type {PluginOptions}
     */
    this.options = {
      test,
      include,
      exclude,
      minimizerOptions,
    };
  }

  /**
   * Build an error message for JSON minimization failures
   * @param {unknown} error The error that occurred
   * @param {string} file The file being processed
   * @param {string} context The compilation context
   * @returns {Error} Formatted error message
   */
  static buildError(error, file, context) {
    return new Error(
      `"${file}" in "${context}" from Json Minimizer:\n${error}`,
    );
  }

  /**
   * Optimize assets by minimizing JSON files
   * @param {Compiler} compiler The webpack compiler instance
   * @param {Compilation} compilation The webpack compilation instance
   * @param {Record<string, import("webpack").sources.Source>} assets The assets to process
   * @returns {Promise<void>} Promise that resolves when optimization is complete
   */
  async optimize(compiler, compilation, assets) {
    const cache = compilation.getCache("JsonMinimizerWebpackPlugin");
    const assetsForMinify = await Promise.all(
      Object.keys(assets)
        .filter((name) => {
          const { info } = /** @type {Asset} */ (compilation.getAsset(name));

          // Skip double minimize assets from child compilation
          if (info.minimized) {
            return false;
          }

          if (
            !compiler.webpack.ModuleFilenameHelpers.matchObject.bind(
              undefined,
              this.options,
            )(name)
          ) {
            return false;
          }

          return true;
        })
        .map(async (name) => {
          const { info, source } = /** @type {Asset} */ (
            compilation.getAsset(name)
          );

          const eTag = cache.getLazyHashedEtag(source);
          const cacheItem = cache.getItemCache(name, eTag);
          const output = await cacheItem.getPromise();

          return { name, info, inputSource: source, output, cacheItem };
        }),
    );

    const { RawSource } = compiler.webpack.sources;

    const scheduledTasks = [];

    for (const asset of assetsForMinify) {
      scheduledTasks.push(
        (async () => {
          const { name, inputSource, cacheItem } = asset;
          let { output } = asset;
          let input;

          const sourceFromInputSource = inputSource.source();

          if (!output) {
            input = sourceFromInputSource;

            if (Buffer.isBuffer(input)) {
              input = input.toString();
            }

            /**
             * @type {InternalOptions}
             */
            const options = {
              input,
              minimizerOptions: this.options.minimizerOptions,
            };

            try {
              output = await internalMinify(options);
            } catch (error) {
              compilation.errors.push(
                /** @type {WebpackError} */ (
                  JsonMinimizerPlugin.buildError(error, name, compiler.context)
                ),
              );

              return;
            }

            output.source = new RawSource(output.code);

            await cacheItem.storePromise({
              source: output.source,
            });
          }

          const newInfo = { minimized: true };
          const { source } = output;

          compilation.updateAsset(name, source, newInfo);
        })(),
      );
    }

    Promise.all(scheduledTasks);
  }

  /**
   * Apply the plugin to the webpack compiler
   * @param {Compiler} compiler The webpack compiler instance
   * @returns {void}
   */
  apply(compiler) {
    const pluginName = this.constructor.name;

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage:
            compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          additionalAssets: true,
        },
        (assets) => this.optimize(compiler, compilation, assets),
      );

      compilation.hooks.statsPrinter.tap(pluginName, (stats) => {
        stats.hooks.print
          .for("asset.info.minimized")
          .tap(
            "json-minimizer-webpack-plugin",
            (minimized, { green, formatFlag }) =>
              minimized
                ? /** @type {(text: string) => string} */ (green)(
                    /** @type {(flag: string) => string} */ (formatFlag)(
                      "minimized",
                    ),
                  )
                : "",
          );
      });
    });
  }
}

module.exports = JsonMinimizerPlugin;
