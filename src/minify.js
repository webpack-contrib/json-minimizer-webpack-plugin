/** @typedef {import("./index.js").InternalOptions} InternalOptions */
/** @typedef {import("./index.js").JSONOptions} JSONOptions */
/** @typedef {import("./index.js").MinimizedResult} MinimizedResult */

const defaultMinimizerOptions = {
  replacer: undefined,

  space: undefined,
};

/**
 * Minify JSON content with specified options
 * @param {InternalOptions} options The options containing input and minimizer options
 * @returns {Promise<MinimizedResult>} Promise that resolves with minimized JSON result
 */
const minify = async (options) => {
  const { input, minimizerOptions } = options;
  const { replacer, space } = {
    ...defaultMinimizerOptions,
    ...minimizerOptions,
  };

  const result = JSON.stringify(JSON.parse(input), replacer, space);

  return { code: result };
};

module.exports = { minify };
