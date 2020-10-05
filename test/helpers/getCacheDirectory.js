import os from 'os';

import findCacheDir from 'find-cache-dir';

function getCacheDirectory() {
  return findCacheDir({ name: 'json-minimizer-webpack-plugin' }) || os.tmpdir();
}

export default getCacheDirectory;
