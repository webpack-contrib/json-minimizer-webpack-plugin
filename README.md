<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# json-minimizer-webpack-plugin

json minimizer plugin for Webpack

## Getting Started

To begin, you'll need to install `json-minimizer-webpack-plugin`:

```console
$ npm install json-minimizer-webpack-plugin --save-dev
```

<!-- isLoader ? use(this) : delete(isPlugin) -->

Then add the loader to your `webpack` config. For example:

<!-- isPlugin ? use(this) : delete(isLoader) -->

Then add the plugin to your `webpack` config. For example:

**file.ext**

```js
import file from 'file.ext';
```

<!-- isLoader ? use(this) : delete(isPlugin) -->

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.ext$/,
        use: [
          {
            loader: `jsonminimizer-loader`,
            options: { ...options },
          },
        ],
      },
    ],
  },
};
```

<!-- isPlugin ? use(this) : delete(isLoader) -->

**webpack.config.js**

```js
module.exports = {
  plugins: [new JsonMinimizerPlugin(options)],
};
```

And run `webpack` via your preferred method.

## Options

### `[option]`

Type: `[type|other-type]`
Default: `[type|null]`

[ option description ]

<!-- isLoader ? use(this) : delete(isPlugin) -->

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `jsonminimizer-loader`,
        options: {
          [option]: '',
        },
      },
    ],
  },
};
```

<!-- isPlugin ? use(this) : delete(isLoader) -->

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new JsonMinimizerPlugin({
      [option]: '',
    }),
  ],
};
```

## Examples

[ example outline text ]

**webpack.config.js**

```js
// Example setup here..
```

**file.ext**

```js
// Source code here...
```

**bundle.js**

```js
// Bundle code here...
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/json-minimizer-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/json-minimizer-webpack-plugin
[node]: https://img.shields.io/node/v/json-minimizer-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/json-minimizer-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/json-minimizer-webpack-plugin
[tests]: https://github.com/webpack-contrib/json-minimizer-webpack-plugin/workflows/json-minimizer-webpack-plugin/badge.svg
[tests-url]: https://github.com/webpack-contrib/json-minimizer-webpack-plugin/actions
[cover]: https://codecov.io/gh/webpack-contrib/json-minimizer-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/json-minimizer-webpack-plugin
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=json-minimizer-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=json-minimizer-webpack-plugin
