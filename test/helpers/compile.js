/**
 * Compile webpack and return a promise with stats
 * @param {import('webpack').Compiler} compiler The webpack compiler instance
 * @returns {Promise<import('webpack').Stats>} Promise that resolves with compilation stats
 */
export default function compile(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err);
      return resolve(stats);
    });
  });
}
