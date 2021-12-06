export default JsonMinimizerPlugin;
export type Schema = import("schema-utils/declarations/validate").Schema;
export type Compiler = import("webpack").Compiler;
export type Compilation = import("webpack").Compilation;
export type Asset = import("webpack").Asset;
export type WebpackError = import("webpack").WebpackError;
export type Rule = RegExp | string;
export type Rules = Rule[] | Rule;
export type JSONOptions = {
  replacer?:
    | ((this: any, key: string, value: any) => any | (number | string)[] | null)
    | undefined;
  space?: string | number | undefined;
};
export type BasePluginOptions = {
  test?: Rules | undefined;
  include?: Rules | undefined;
  exclude?: Rules | undefined;
  minimizerOptions?: JSONOptions | undefined;
};
export type MinimizedResult = {
  code: string;
};
export type InternalOptions = {
  input: string;
  minimizerOptions?: JSONOptions | undefined;
};
export type InternalPluginOptions = BasePluginOptions;
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").Asset} Asset */
/** @typedef {import("webpack").WebpackError} WebpackError */
/** @typedef {RegExp | string} Rule */
/** @typedef {Rule[] | Rule} Rules */
/**
 * @typedef {Object} JSONOptions
 * @property {(this: any, key: string, value: any) => any | (number | string)[] | null} [replacer]
 * @property {string | number} [space]
 */
/**
 * @typedef {Object} BasePluginOptions
 * @property {Rules} [test]
 * @property {Rules} [include]
 * @property {Rules} [exclude]
 * @property {JSONOptions} [minimizerOptions]
 */
/**
 * @typedef {Object} MinimizedResult
 * @property {string} code
 */
/**
 * @typedef {Object} InternalOptions
 * @property {string} input
 * @property {JSONOptions} [minimizerOptions]
 */
/**
 * @typedef {BasePluginOptions} InternalPluginOptions
 */
declare class JsonMinimizerPlugin {
  /**
   * @private
   * @param {any} error
   * @param {string} file
   * @param {string} context
   * @returns {Error}
   */
  private static buildError;
  /**
   * @param {BasePluginOptions} [options]
   */
  constructor(options?: BasePluginOptions | undefined);
  /**
   * @private
   * @type {InternalPluginOptions}
   */
  private options;
  /**
   * @private
   * @param {Compiler} compiler
   * @param {Compilation} compilation
   * @param {Record<string, import("webpack").sources.Source>} assets
   * @returns {Promise<void>}
   */
  private optimize;
  /**
   * @param {Compiler} compiler
   * @returns {void}
   */
  apply(compiler: Compiler): void;
}
