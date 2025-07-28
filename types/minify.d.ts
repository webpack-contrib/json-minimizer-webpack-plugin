export type InternalOptions = import("./index.js").InternalOptions;
export type JSONOptions = import("./index.js").JSONOptions;
export type MinimizedResult = import("./index.js").MinimizedResult;
/**
 * Minify JSON content with specified options
 * @param {InternalOptions} options The options containing input and minimizer options
 * @returns {Promise<MinimizedResult>} Promise that resolves with minimized JSON result
 */
export function minify(options: InternalOptions): Promise<MinimizedResult>;
