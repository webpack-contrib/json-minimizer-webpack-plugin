import readAsset from "./readAsset";

/**
 * Read assets from webpack compilation stats
 * @param {import('webpack').Compiler} compiler The webpack compiler instance
 * @param {import('webpack').Stats} stats The webpack compilation stats
 * @param {RegExp} extRegexp Regular expression to filter assets by extension
 * @returns {{[key: string]: string}} Object containing filtered assets
 */
export default function readAssets(compiler, stats, extRegexp) {
  const assets = {};

  for (const asset of Object.keys(stats.compilation.assets)) {
    if (extRegexp && extRegexp.test(asset)) {
      assets[asset] = readAsset(asset, compiler, stats);
    }
  }

  return assets;
}
