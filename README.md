<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![discussion][discussion]][discussion-url]
[![size][size]][size-url]

# json-minimizer-webpack-plugin

This plugin uses [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) to minify your JSON files during the build process.

## Getting Started

To begin, you'll need to install `json-minimizer-webpack-plugin`:

```console
npm install json-minimizer-webpack-plugin --save-dev
```

or

```console
yarn add -D json-minimizer-webpack-plugin
```

or

```console
pnpm add -D json-minimizer-webpack-plugin
```

Then add the plugin to your `webpack` configuration. For example:

**webpack.config.js**

```js
const CopyPlugin = require("copy-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, "dist"),
          from: "./src/*.json",
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`
      new JsonMinimizerPlugin(),
    ],
  },
};
```

Finally, run `webpack` using the method you normally use (e.g., via CLI or an npm script).

## Options

- **[`test`](#test)**
- **[`include`](#include)**
- **[`exclude`](#exclude)**
- **[`minimizerOptions`](#minimizeroptions)**

### `test`

Type:

```ts
type test = string | RegExp | (string | RegExp)[];
```

Default: `/\.json(\?.*)?$/i`

Test to match files against.

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new JsonMinimizerPlugin({
        test: /\.foo\.json/i,
      }),
    ],
  },
};
```

### `include`

Type:

```ts
type include = string | RegExp | (string | RegExp)[];
```

Default: `undefined`

Files to include for minimization.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new JsonMinimizerPlugin({
        include: /\/includes/,
      }),
    ],
  },
};
```

### `exclude`

Type:

```ts
type exclude = string | RegExp | (string | RegExp)[];
```

Default: `undefined`

Files to exclude from minimization.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new JsonMinimizerPlugin({
        exclude: /\/excludes/,
      }),
    ],
  },
};
```

### `minimizerOptions`

Type:

<!-- eslint-skip -->

```ts
interface minimizerOptions {
  space?: null | string | number;
  replacer?: null | Function | (string | number)[];
}
```

Default: `{ replacer: null, space: null }`

`JSON.stringify()` [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new JsonMinimizerPlugin({
        minimizerOptions: {
          space: "\t",
        },
      }),
    ],
  },
};
```

## Contributing

We welcome all contributions!
If you're new here, please take a moment to review our contributing guidelines before submitting issues or pull requests.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/json-minimizer-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/json-minimizer-webpack-plugin
[node]: https://img.shields.io/node/v/json-minimizer-webpack-plugin.svg
[node-url]: https://nodejs.org
[tests]: https://github.com/webpack-contrib/json-minimizer-webpack-plugin/workflows/json-minimizer-webpack-plugin/badge.svg
[tests-url]: https://github.com/webpack-contrib/json-minimizer-webpack-plugin/actions
[cover]: https://codecov.io/gh/webpack-contrib/json-minimizer-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/json-minimizer-webpack-plugin
[discussion]: https://img.shields.io/github/discussions/webpack/webpack
[discussion-url]: https://github.com/webpack/webpack/discussions
[size]: https://packagephobia.now.sh/badge?p=json-minimizer-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=json-minimizer-webpack-plugin
