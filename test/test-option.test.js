const JsonMinimizerPlugin = require("../src/index");

const {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readAssets,
} = require("./helpers");

describe('when applied with "test" option', () => {
  let compiler;

  beforeEach(() => {
    jest.clearAllMocks();

    const testJsonId = "./test/foo-[0-4].json";

    compiler = getCompiler(testJsonId);
  });

  it("matches snapshot with empty value", async () => {
    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('matches snapshot for a single "test" value (RegExp)', async () => {
    new JsonMinimizerPlugin({
      test: /foo-[1-3]\.json/,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('matches snapshot for multiple "test" value (RegExp)', async () => {
    new JsonMinimizerPlugin({
      test: [/foo-[0]\.json/, /foo-[1-2]\.json/],
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });
});
