import path from "node:path";

import CopyPlugin from "copy-webpack-plugin";
import { Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";

/**
 * Create a webpack compiler instance for testing
 * @param {string} jsonFixture Path to JSON fixture file
 * @param {object} config Additional webpack configuration
 * @returns {import('webpack').Compiler} Webpack compiler instance
 */
export default function getCompiler(jsonFixture, config = {}) {
  const compiler = webpack(
    Array.isArray(config)
      ? config
      : {
          mode: "production",
          bail: true,
          devtool: config.devtool || false,
          context: path.resolve(__dirname, "../fixtures"),
          entry: path.resolve(__dirname, "../fixtures/entry.js"),
          optimization: {
            minimize: false,
          },
          output: {
            pathinfo: false,
            path: path.resolve(__dirname, "../dist"),
            filename: "[name].js",
            chunkFilename: "[id].[name].js",
          },
          plugins: [
            jsonFixture
              ? [
                  new CopyPlugin({
                    patterns: [
                      {
                        context: path.resolve(__dirname, "..", "fixtures"),
                        from: jsonFixture,
                      },
                    ],
                  }),
                ]
              : [],
          ].flat(),
          module: {
            rules: [
              !jsonFixture
                ? [
                    {
                      test: /\.json$/i,
                      type: "asset/resource",
                      generator: {
                        filename: "[name][ext]",
                      },
                    },
                  ]
                : [],
            ].flat(),
          },
          ...config,
        },
  );

  if (!config.outputFileSystem) {
    compiler.outputFileSystem = createFsFromVolume(new Volume());
  }

  return compiler;
}

getCompiler.isWebpack4 = () => webpack.version[0] === "4";
