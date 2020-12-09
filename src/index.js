import { validate } from "schema-utils";
import serialize from "serialize-javascript";

import schema from "./options.json";
import { minify as minifyFn } from "./minify";

class JsonMinimizerPlugin {
  constructor(options = {}) {
    validate(schema, options, {
      name: "Json Minimizer Plugin",
      baseDataPath: "options",
    });

    const {
      minimizerOptions = {},
      test = /\.json(\?.*)?$/i,
      include,
      exclude,
    } = options;

    this.options = {
      test,
      include,
      exclude,
      minimizerOptions,
    };
  }

  static buildError(error, file, context) {
    return new Error(
      `"${file}" in "${context}" from Json Minimizer:\n${error}`
    );
  }

  async optimize(compiler, compilation, assets) {
    const cache = compilation.getCache("JsonMinimizerWebpackPlugin");
    const assetsForMinify = await Promise.all(
      Object.keys(assets)
        .filter((name) => {
          const { info } = compilation.getAsset(name);

          // Skip double minimize assets from child compilation
          if (info.minimized) {
            return false;
          }

          if (
            !compiler.webpack.ModuleFilenameHelpers.matchObject.bind(
              // eslint-disable-next-line no-undefined
              undefined,
              this.options
            )(name)
          ) {
            return false;
          }

          return true;
        })
        .map(async (name) => {
          const { info, source } = compilation.getAsset(name);

          const eTag = cache.getLazyHashedEtag(source);
          const cacheItem = cache.getItemCache(name, eTag);
          const output = await cacheItem.getPromise();

          return { name, info, inputSource: source, output, cacheItem };
        })
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

            const options = {
              input,
              minimizerOptions: { ...this.options.minimizerOptions },
              minify: this.options.minify,
            };

            try {
              output = await minifyFn(options);
            } catch (error) {
              compilation.errors.push(
                JsonMinimizerPlugin.buildError(error, name, compiler.context)
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
        })()
      );
    }

    Promise.all(scheduledTasks);
  }

  apply(compiler) {
    const pluginName = this.constructor.name;

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      const hooks = compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(
        compilation
      );

      const data = serialize({
        jsonMinimizerOptions: this.options.minimizerOptions,
      });

      hooks.chunkHash.tap(pluginName, (chunk, hash) => {
        hash.update("JsonMinimizerPlugin");
        hash.update(data);
      });

      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage:
            compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          additionalAssets: true,
        },
        (assets) => this.optimize(compiler, compilation, assets)
      );

      compilation.hooks.statsPrinter.tap(pluginName, (stats) => {
        stats.hooks.print
          .for("asset.info.minimized")
          .tap(
            "json-minimizer-webpack-plugin",
            (minimized, { green, formatFlag }) =>
              // eslint-disable-next-line no-undefined
              minimized ? green(formatFlag("minimized")) : undefined
          );
      });
    });
  }
}

export default JsonMinimizerPlugin;
