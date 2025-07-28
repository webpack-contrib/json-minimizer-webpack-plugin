/**
 * Remove current working directory from error messages
 * @param {string} str The string to process
 * @returns {string} String with CWD removed
 */
function removeCWD(str) {
  const isWin = process.platform === "win32";
  let cwd = process.cwd();

  if (isWin) {
    str = str.replaceAll("\\", "/");

    cwd = cwd.replaceAll("\\", "/");
  }

  return str.replaceAll(new RegExp(cwd, "g"), "");
}

/**
 * Normalize error messages by removing CWD and limiting to first two lines
 * @param {Array} errors Array of error objects
 * @returns {Array<string>} Array of normalized error strings
 */
export default (errors) =>
  errors.map((error) =>
    removeCWD(error.toString().split("\n").slice(0, 2).join("\n")),
  );
