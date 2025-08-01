import path from "node:path";

import JsonMinimizerPlugin from "../src/index";

import {
  EmitNewAsset,
  ModifyExistingAsset,
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readAssets,
} from "./helpers";

describe("JsonMinimizerPlugin", () => {
  it("should work (without options)", async () => {
    const testJsonId = "./simple.json";
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with array", async () => {
    const testJsonId = "./array.json";
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should emit error when an empty file", async () => {
    const testJsonId = "./empty.json";
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work without files", async () => {
    const testJsonId = "./simple.json";
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin({
      include: "nothing",
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with child compilation", async () => {
    const testJsonId = "./simple.json";
    const compiler = getCompiler(testJsonId, {
      module: {
        rules: [
          {
            test: /entry.js$/i,
            use: [
              {
                loader: path.resolve(
                  __dirname,
                  "./helpers/emitAssetInChildCompilationLoader",
                ),
              },
            ],
          },
        ],
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should emit error when broken json syntax", async () => {
    const testJsonId = "./broken-json-syntax.json";
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);
    const statsErrors = getErrors(stats);

    expect(statsErrors[0]).toContain(
      'Error: "broken-json-syntax.json" in "/test/fixtures" from Json Minimizer:',
    );

    const match = process.version.match(
      /^v(\d{1,2})\.(\d{1,2})\.(\d{1,2})(?:-([0-9A-Za-z-.]+))?(?:\+([0-9A-Za-z-.]+))?$/,
    );

    if (Number.parseInt(match[1], 10) >= 20) {
      expect(statsErrors[0]).toContain(
        "SyntaxError: Expected property name or '}' in JSON at position 4",
      );
    } else {
      expect(statsErrors[0]).toContain(
        "SyntaxError: Unexpected token s in JSON at position 4",
      );
    }

    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('should work and use cache by default in "development" mode', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      mode: "development",
      entry: {
        foo: path.resolve(__dirname, "./fixtures/cache.js"),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(6);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");

    await new Promise((resolve) => {
      compile(compiler).then((newStats) => {
        expect(newStats.compilation.emittedAssets.size).toBe(0);

        expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
          "assets",
        );
        expect(getWarnings(newStats)).toMatchSnapshot("errors");
        expect(getErrors(newStats)).toMatchSnapshot("warnings");

        resolve();
      });
    });
  });

  it("should work and use memory cache", async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      cache: { type: "memory" },
      entry: {
        foo: path.resolve(__dirname, "./fixtures/cache.js"),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(6);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");

    await new Promise((resolve) => {
      compile(compiler).then((newStats) => {
        expect(newStats.compilation.emittedAssets.size).toBe(0);

        expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
          "assets",
        );
        expect(getWarnings(newStats)).toMatchSnapshot("errors");
        expect(getErrors(newStats)).toMatchSnapshot("warnings");

        resolve();
      });
    });
  });

  it('should work and use memory cache when the "cache" option is "true"', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      cache: true,
      entry: {
        foo: path.resolve(__dirname, "./fixtures/cache.js"),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(6);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");

    await new Promise((resolve) => {
      compile(compiler).then((newStats) => {
        expect(newStats.compilation.emittedAssets.size).toBe(0);

        expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
          "assets",
        );
        expect(getWarnings(newStats)).toMatchSnapshot("errors");
        expect(getErrors(newStats)).toMatchSnapshot("warnings");

        resolve();
      });
    });
  });

  it('should work and use memory cache when the "cache" option is "true" and the asset has been changed', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      cache: true,
      entry: {
        foo: path.resolve(__dirname, "./fixtures/cache.js"),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(6);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");

    new ModifyExistingAsset({ name: "cache.json" }).apply(compiler);
    new ModifyExistingAsset({ name: "cache-1.json" }).apply(compiler);

    await new Promise((resolve) => {
      compile(compiler).then((newStats) => {
        expect(newStats.compilation.emittedAssets.size).toBe(2);

        expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
          "assets",
        );
        expect(getWarnings(newStats)).toMatchSnapshot("errors");
        expect(getErrors(newStats)).toMatchSnapshot("warnings");

        resolve();
      });
    });
  });

  it('should work and do not use memory cache when the "cache" option is "false"', async () => {
    const testJsonId = false;
    const compiler = getCompiler(testJsonId, {
      cache: false,
      entry: {
        foo: path.resolve(__dirname, "./fixtures/cache.js"),
      },
    });

    new JsonMinimizerPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(6);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");

    await new Promise((resolve) => {
      compile(compiler).then((newStats) => {
        expect(newStats.compilation.emittedAssets.size).toBe(6);

        expect(readAssets(compiler, newStats, /\.json$/i)).toMatchSnapshot(
          "assets",
        );
        expect(getWarnings(newStats)).toMatchSnapshot("errors");
        expect(getErrors(newStats)).toMatchSnapshot("warnings");

        resolve();
      });
    });
  });

  it("should run plugin against assets added later by plugins", async () => {
    const testJsonId = "./simple.json";
    const compiler = getCompiler(testJsonId);

    new JsonMinimizerPlugin().apply(compiler);
    new EmitNewAsset({ name: "newFile.json" }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, /\.json$/i)).toMatchSnapshot("assets");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });
});
