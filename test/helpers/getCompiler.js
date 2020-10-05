import path from 'path';

import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';
import CopyPlugin from 'copy-webpack-plugin';

export default function getCompiler(jsonFixture, config = {}) {
  const compiler = webpack(
    Array.isArray(config)
      ? config
      : {
          mode: 'production',
          bail: true,
          devtool: config.devtool || false,
          context: path.resolve(__dirname, '../fixtures'),
          entry: path.resolve(__dirname, '../fixtures/entry.js'),
          optimization: {
            minimize: false,
          },
          output: {
            pathinfo: false,
            path: path.resolve(__dirname, '../dist'),
            filename: '[name].js',
            chunkFilename: '[id].[name].js',
          },
          plugins: [].concat(
            jsonFixture
              ? [
                  new CopyPlugin({
                    patterns: [
                      {
                        context: path.resolve(__dirname, '..', 'fixtures'),
                        from: jsonFixture,
                      },
                    ],
                  }),
                ]
              : []
          ),
          module: {
            rules: [].concat(
              !jsonFixture
                ? [
                    {
                      test: /\.json$/i,
                      type: 'javascript/auto',
                      use: [
                        {
                          loader: 'file-loader',
                          options: {
                            name: '[name].[ext]',
                          },
                        },
                      ],
                    },
                  ]
                : []
            ),
          },
          ...config,
        }
  );

  if (!config.outputFileSystem) {
    const outputFileSystem = createFsFromVolume(new Volume());
    // Todo remove when we drop webpack@4 support
    outputFileSystem.join = path.join.bind(path);

    compiler.outputFileSystem = outputFileSystem;
  }

  return compiler;
}

getCompiler.isWebpack4 = () => webpack.version[0] === '4';
