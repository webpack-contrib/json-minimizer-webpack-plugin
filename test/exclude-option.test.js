import JsonMinimizerPlugin from '../src/index';

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readAssets,
  removeCache,
} from './helpers';

describe('exclude option', () => {
  let compiler;

  beforeEach(() => {
    const testJsonId = './include-exclude/*.json';

    compiler = getCompiler(testJsonId);

    return Promise.all([removeCache()]);
  });

  afterEach(() => Promise.all([removeCache()]));

  it('should match snapshot for a single RegExp value exclude', async () => {
    new JsonMinimizerPlugin({
      exclude: /include-exclude\/exclude/i,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for multiple RegExp values exclude', async () => {
    new JsonMinimizerPlugin({
      exclude: [
        /include-exclude\/exclude-(1)/i,
        /include-exclude\/exclude-(2)/i,
      ],
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for multiple String values exclude', async () => {
    new JsonMinimizerPlugin({
      exclude: ['include-exclude/exclude-1', 'include-exclude/exclude-2'],
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });
});
