const { validate } = require("schema-utils");

const schema = require("./options.json");
const { minify: internalMinify } = require("./minify");

/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").Asset} Asset */
/** @typedef {import("webpack").WebpackError} WebpackError*/

/** @typedef {RegExp | string} Rule */
/** @typedef {Rule[] | Rule} Rules */

/**
 * @typedef {Object} JSONOptions
 * @property {(this: any, key: string, value: any) => any | (number | string)[] | null} [replacer]
 * @property {string | number} [space]
 */

/**
 * @typedef {Object} BasePluginOptions
 * @property {Rule} [test]
 * @property {Rule} [include]
 * @property {Rule} [exclude]
 * @property {JSONOptions} [minimizerOptions]
 */

/**
 * @typedef {Object} MinimizedResult
 * @property {string} code
 */

/**
 * @typedef {Object} InternalOptions
 * @property {string} input
 * @property {JSONOptions} [minimizerOptions]
 */

/**
 * @typedef {BasePluginOptions} PluginOptions
 */

class JsonMinimizerPlugin {
  /**
   * @param {PluginOptions} [options]
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
     * @private
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
   * @param {any} error
   * @param {string} file
   * @param {string} context
   * @returns {Error}
   */
  static buildError(error, file, context) {
    return new Error(
      `"${file}" in "${context}" from Json Minimizer:\n${error}`,
    );
  }

  /**
   * @private
   * @param {Compiler} compiler
   * @param {Compilation} compilation
   * @param {Record<string, import("webpack").sources.Source>} assets
   * @returns {Promise<void>}
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
              // eslint-disable-next-line no-undefined
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
   * @param {Compiler} compiler
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
                ? /** @type {Function} */ (green)(
                    /** @type {Function} */ (formatFlag)("minimized"),
                  )
                : "",
          );
      });
    });
  }
}

module.exports = JsonMinimizerPlugin;
