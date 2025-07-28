/**
 * Normalize source map for testing purposes
 * @param {string} map The source map string to normalize
 * @returns {string} Normalized source map string
 */
export default function normalizedSourceMap(map) {
  return map.replace(
    // eslint-disable-next-line no-useless-escape
    /"sources":\[([\d\w\/\:\"\'].*)\]\,\"names\"/i,
    '"sources": [replaced for tests], "names"',
  );
}
