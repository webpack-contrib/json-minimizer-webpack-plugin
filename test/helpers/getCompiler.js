import path from "path";

import webpack from "webpack";
import { createFsFromVolume, Volume } from "memfs";
import CopyPlugin from "copy-webpack-plugin";

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
          plugins: [].concat(
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
          ),
          module: {
            rules: [].concat(
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
            ),
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
