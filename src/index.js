import crypto from 'crypto';

import webpack, {
  ModuleFilenameHelpers,
  version as webpackVersion,
} from 'webpack';

import { validate } from 'schema-utils';

import schema from './options.json';

import { minify as minifyFn } from './minify';

// webpack 5 exposes the sources property to ensure the right version of webpack-sources is used
const { RawSource } =
  // eslint-disable-next-line global-require
  webpack.sources || require('webpack-sources');

class JsonMinimizerPlugin {
  constructor(options = {}) {
    validate(schema, options, {
      name: 'Json Minimizer Plugin',
      baseDataPath: 'options',
    });

    const {
      minimizerOptions = {},
      test = /\.json(\?.*)?$/i,
      cache = true,
      cacheKeys = (defaultCacheKeys) => defaultCacheKeys,
      include,
      exclude,
    } = options;

    this.options = {
      test,
      cache,
      cacheKeys,
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

  // eslint-disable-next-line consistent-return
  static getAsset(compilation, name) {
    // New API
    if (compilation.getAsset) {
      return compilation.getAsset(name);
    }

    if (compilation.assets[name]) {
      return { name, source: compilation.assets[name], info: {} };
    }
  }

  static updateAsset(compilation, name, newSource, assetInfo) {
    // New API
    if (compilation.updateAsset) {
      compilation.updateAsset(name, newSource, assetInfo);
    }

    // eslint-disable-next-line no-param-reassign
    compilation.assets[name] = newSource;
  }

  async optimize(compiler, compilation, assets, CacheEngine, weakCache) {
    const assetNames = Object.keys(
      typeof assets === 'undefined' ? compilation.assets : assets
    ).filter((assetName) =>
      // eslint-disable-next-line no-undefined
      ModuleFilenameHelpers.matchObject.bind(undefined, this.options)(assetName)
    );

    if (assetNames.length === 0) {
      return Promise.resolve();
    }

    const scheduledTasks = [];
    const cache = new CacheEngine(
      compilation,
      {
        cache: this.options.cache,
      },
      weakCache
    );

    for (const name of assetNames) {
      scheduledTasks.push(
        (async () => {
          const { source: inputSource, info } = JsonMinimizerPlugin.getAsset(
            compilation,
            name
          );

          // Skip double minimize assets from child compilation
          if (info.minimized) {
            return;
          }

          let input = inputSource.source();

          if (Buffer.isBuffer(input)) {
            input = input.toString();
          }

          const cacheData = { inputSource };

          if (JsonMinimizerPlugin.isWebpack4()) {
            if (this.options.cache) {
              cacheData.input = input;
              cacheData.cacheKeys = this.options.cacheKeys(
                {
                  // eslint-disable-next-line global-require
                  'json-minimizer-webpack-plugin': require('../package.json')
                    .version,
                  'json-minimizer-webpack-plugin-options': this.options,
                  name,
                  contentHash: crypto
                    .createHash('md4')
                    .update(input)
                    .digest('hex'),
                },
                name
              );
            }
          } else {
            cacheData.name = name;
          }

          let output = await cache.get(cacheData, { RawSource });

          if (!output) {
            try {
              const minimizerOptions = {
                input,
                minimizerOptions: this.options.minimizerOptions,
                minify: this.options.minify,
              };

              output = await minifyFn(minimizerOptions);
            } catch (error) {
              compilation.errors.push(
                JsonMinimizerPlugin.buildError(error, name, compiler.context)
              );

              return;
            }

            output.source = new RawSource(output.output);

            await cache.store({ ...output, ...cacheData });
          }

          // TODO `...` required only for webpack@4
          JsonMinimizerPlugin.updateAsset(compilation, name, output.source, {
            ...info,
            minimized: true,
          });
        })()
      );
    }

    return Promise.all(scheduledTasks);
  }

  static isWebpack4() {
    return webpackVersion[0] === '4';
  }

  apply(compiler) {
    const pluginName = this.constructor.name;
    const weakCache = new WeakMap();

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      if (JsonMinimizerPlugin.isWebpack4()) {
        // eslint-disable-next-line global-require
        const CacheEngine = require('./Webpack4Cache').default;

        compilation.hooks.optimizeChunkAssets.tapPromise(pluginName, () => {
          return this.optimize(
            compiler,
            compilation,
            // eslint-disable-next-line no-undefined
            undefined,
            CacheEngine,
            weakCache
          );
        });
      } else {
        // eslint-disable-next-line global-require
        const CacheEngine = require('./Webpack5Cache').default;

        // eslint-disable-next-line global-require
        const Compilation = require('webpack/lib/Compilation');

        compilation.hooks.processAssets.tapPromise(
          {
            name: pluginName,
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          },
          (assets) => this.optimize(compiler, compilation, assets, CacheEngine)
        );

        compilation.hooks.statsPrinter.tap(pluginName, (stats) => {
          stats.hooks.print
            .for('asset.info.minimized')
            .tap(
              'json-minimizer-webpack-plugin',
              (minimized, { green, formatFlag }) =>
                // eslint-disable-next-line no-undefined
                minimized ? green(formatFlag('minimized')) : undefined
            );
        });
      }
    });
  }
}

export default JsonMinimizerPlugin;
