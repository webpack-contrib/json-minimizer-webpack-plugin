const defaultMinimizerOptions = {
  replacer: null,
  space: null,
};

const minify = async (options) => {
  const { input, minimizerOptions } = options;
  const { replacer, space } = {
    ...defaultMinimizerOptions,
    ...minimizerOptions,
  };

  const result = JSON.stringify(JSON.parse(input), replacer, space);

  return { code: result };
};

module.exports.minify = minify;
