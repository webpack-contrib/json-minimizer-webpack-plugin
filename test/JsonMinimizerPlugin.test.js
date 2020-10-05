import path from 'path';

import JsonMinimizerPlugin from '../src/index';

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readAssets,
  removeCache,
  ModifyExistingAsset,
} from './helpers';

describe('JsonMinimizerPlugin', () => {
  beforeEach(() => Promise.all([removeCache()]));

  afterEach(() => Promise.all([removeCache()]));

  it('should work (without options)', async () => {
    const testJsonId = './simple.json';
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with an empty file', async () => {
    const testJsonId = './empty.json';
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work without files', async () => {
    const testJsonId = './simple.json';
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin({
      include: 'nothing',
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with child compilation', async () => {
    const testJsonId = './simple.json';
    const compiler = getCompiler(testJsonId, {
      module: {
        rules: [
          {
            test: /entry.js$/i,
            use: [
              {
                loader: path.resolve(
                  __dirname,
                  './helpers/emitAssetInChildCompilationLoader'
                ),
              },
            ],
          },
        ],
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should emit error when broken json syntax', async () => {
    const testJsonId = './broken-json-syntax.json';
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work and use cache by default in "development" mode', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      mode: 'development',
      entry: {
        foo: path.resolve(__dirname, './fixtures/cache.js'),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    if (getCompiler.isWebpack4()) {
      expect(
        Object.keys(stats.compilation.assets).filter((assetName) => {
          return stats.compilation.assets[assetName].emitted;
        }).length
      ).toBe(6);
    } else {
      expect(stats.compilation.emittedAssets.size).toBe(6);
    }

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      if (getCompiler.isWebpack4()) {
        expect(
          Object.keys(newStats.compilation.assets).filter((assetName) => {
            return newStats.compilation.assets[assetName].emitted;
          }).length
        ).toBe(0);
      } else {
        expect(newStats.compilation.emittedAssets.size).toBe(0);
      }

      expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
        'assets'
      );
      expect(getWarnings(newStats)).toMatchSnapshot('errors');
      expect(getErrors(newStats)).toMatchSnapshot('warnings');

      resolve();
    });
  });

  it('should work and use memory cache', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      ...(getCompiler.isWebpack4()
        ? { cache: true }
        : { cache: { type: 'memory' } }),
      entry: {
        foo: path.resolve(__dirname, './fixtures/cache.js'),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    if (getCompiler.isWebpack4()) {
      expect(
        Object.keys(stats.compilation.assets).filter((assetName) => {
          return stats.compilation.assets[assetName].emitted;
        }).length
      ).toBe(6);
    } else {
      expect(stats.compilation.emittedAssets.size).toBe(6);
    }

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      if (getCompiler.isWebpack4()) {
        expect(
          Object.keys(newStats.compilation.assets).filter((assetName) => {
            return newStats.compilation.assets[assetName].emitted;
          }).length
        ).toBe(0);
      } else {
        expect(newStats.compilation.emittedAssets.size).toBe(0);
      }

      expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
        'assets'
      );
      expect(getWarnings(newStats)).toMatchSnapshot('errors');
      expect(getErrors(newStats)).toMatchSnapshot('warnings');

      resolve();
    });
  });

  it('should work and use memory cache when the "cache" option is "true"', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      cache: true,
      entry: {
        foo: path.resolve(__dirname, './fixtures/cache.js'),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    if (getCompiler.isWebpack4()) {
      expect(
        Object.keys(stats.compilation.assets).filter((assetName) => {
          return stats.compilation.assets[assetName].emitted;
        }).length
      ).toBe(6);
    } else {
      expect(stats.compilation.emittedAssets.size).toBe(6);
    }

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      if (getCompiler.isWebpack4()) {
        expect(
          Object.keys(newStats.compilation.assets).filter((assetName) => {
            return newStats.compilation.assets[assetName].emitted;
          }).length
        ).toBe(0);
      } else {
        expect(newStats.compilation.emittedAssets.size).toBe(0);
      }

      expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
        'assets'
      );
      expect(getWarnings(newStats)).toMatchSnapshot('errors');
      expect(getErrors(newStats)).toMatchSnapshot('warnings');

      resolve();
    });
  });

  it('should work and use memory cache when the "cache" option is "true" and the asset has been changed', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      cache: true,
      entry: {
        foo: path.resolve(__dirname, './fixtures/cache.js'),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    if (getCompiler.isWebpack4()) {
      expect(
        Object.keys(stats.compilation.assets).filter((assetName) => {
          return stats.compilation.assets[assetName].emitted;
        }).length
      ).toBe(6);
    } else {
      expect(stats.compilation.emittedAssets.size).toBe(6);
    }

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');

    new ModifyExistingAsset({ name: 'cache.json' }).apply(compiler);
    new ModifyExistingAsset({ name: 'cache-1.json' }).apply(compiler);

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      if (getCompiler.isWebpack4()) {
        expect(
          Object.keys(newStats.compilation.assets).filter((assetName) => {
            return newStats.compilation.assets[assetName].emitted;
          }).length
        ).toBe(2);
      } else {
        expect(newStats.compilation.emittedAssets.size).toBe(2);
      }

      expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
        'assets'
      );
      expect(getWarnings(newStats)).toMatchSnapshot('errors');
      expect(getErrors(newStats)).toMatchSnapshot('warnings');

      resolve();
    });
  });

  it('should work and do not use memory cache when the "cache" option is "false"', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      cache: false,
      entry: {
        foo: path.resolve(__dirname, './fixtures/cache.js'),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    if (getCompiler.isWebpack4()) {
      expect(
        Object.keys(stats.compilation.assets).filter((assetName) => {
          return stats.compilation.assets[assetName].emitted;
        }).length
      ).toBe(6);
    } else {
      expect(stats.compilation.emittedAssets.size).toBe(6);
    }

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      if (getCompiler.isWebpack4()) {
        expect(
          Object.keys(newStats.compilation.assets).filter((assetName) => {
            return newStats.compilation.assets[assetName].emitted;
          }).length
        ).toBe(6);
      } else {
        expect(newStats.compilation.emittedAssets.size).toBe(6);
      }

      expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
        'assets'
      );
      expect(getWarnings(newStats)).toMatchSnapshot('errors');
      expect(getErrors(newStats)).toMatchSnapshot('warnings');

      resolve();
    });
  });
});
