import JsonMinimizerPlugin from "../src/index";

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readAssets,
} from "./helpers";

describe('when applied with "minimizerOptions" option', () => {
  it('should work "space" options', async () => {
    const testHtmlId = "./simple.json";
    const compiler = getCompiler(testHtmlId);

    new JsonMinimizerPlugin({
      minimizerOptions: {
        space: 2,
      },
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('should work "replacer" options', async () => {
    const testHtmlId = "./simple.json";
    const compiler = getCompiler(testHtmlId);

    new JsonMinimizerPlugin({
      minimizerOptions: {
        replacer: ["squadName", "homeTown"],
      },
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('should work if "replacer" options is function', async () => {
    const testHtmlId = "./simple.json";
    const compiler = getCompiler(testHtmlId);

    new JsonMinimizerPlugin({
      minimizerOptions: {
        replacer: (key, value) => {
          if (Array.isArray(value)) {
            return undefined;
          }

          return value;
        },
      },
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });
});
