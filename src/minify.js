/** @typedef {import("./index.js").InternalOptions} InternalOptions */
/** @typedef {import("./index.js").JSONOptions} JSONOptions */
/** @typedef {import("./index.js").MinimizedResult} MinimizedResult */

const defaultMinimizerOptions = {
  // eslint-disable-next-line no-undefined
  replacer: undefined,
  // eslint-disable-next-line no-undefined
  space: undefined,
};

/**
 * @param {InternalOptions} options
 * @returns {Promise<MinimizedResult>}
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
