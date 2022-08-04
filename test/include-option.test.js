const JsonMinimizerPlugin = require("../src/index");

const {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readAssets,
} = require("./helpers");

describe("include option", () => {
  let compiler;

  beforeEach(() => {
    const testJsonId = "./include-exclude/*.json";

    compiler = getCompiler(testJsonId);
  });

  it("should match snapshot for a single RegExp value include", async () => {
    new JsonMinimizerPlugin({
      include: /include-exclude\/include/i,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should match snapshot for multiple RegExp values include", async () => {
    new JsonMinimizerPlugin({
      include: [
        /include-exclude\/include-(1|2)/i,
        /include-exclude\/include-(3|4)/i,
      ],
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should match snapshot for multiple String values include", async () => {
    new JsonMinimizerPlugin({
      exclude: [
        "include-exclude/include-1",
        "include-exclude/include-2",
        "include-exclude/include-3",
        "include-exclude/include-4",
      ],
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });
});
