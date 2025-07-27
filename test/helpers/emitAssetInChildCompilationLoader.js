class PreCopyPlugin {
  constructor(options = {}) {
    this.options = options.options || {};
  }

  apply(compiler) {
    const plugin = { name: "PreCopyPlugin" };
    const { RawSource } = compiler.webpack.sources;

    compiler.hooks.compilation.tap(plugin, (compilation) => {
      compilation.hooks.additionalAssets.tapAsync(plugin, (callback) => {
        compilation.emitAsset("simple.json", new RawSource('{"x": 5}'));

        callback();
      });
    });
  }
}

/**
 * Webpack loader that creates a child compilation with asset emission
 * @returns {void}
 */
export default function loader() {
  const callback = this.async();

  const childCompiler = this._compilation.createChildCompiler(
    "preloader",
    this.options,
  );

  new PreCopyPlugin().apply(childCompiler);

  childCompiler.runAsChild((error) => {
    if (error) {
      return callback(error);
    }

    return callback(null, "export default 1");
  });
}
