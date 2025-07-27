export = JsonMinimizerPlugin;
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").Asset} Asset */
/** @typedef {import("webpack").WebpackError} WebpackError */
/** @typedef {RegExp | string} Rule */
/** @typedef {Rule[] | Rule} Rules */
/**
 * @typedef {object} JSONOptions
 * @property {(this: unknown, key: string, value: unknown) => unknown | (number | string)[] | null=} replacer JSON replacer function or array
 * @property {string | number=} space JSON space parameter for formatting
 */
/**
 * @typedef {object} BasePluginOptions
 * @property {Rule=} test Test pattern for matching files
 * @property {Rule=} include Include pattern for files
 * @property {Rule=} exclude Exclude pattern for files
 * @property {JSONOptions=} minimizerOptions Options for JSON minimization
 */
/**
 * @typedef {object} MinimizedResult
 * @property {string} code The minimized JSON code
 */
/**
 * @typedef {object} InternalOptions
 * @property {string} input The input JSON string to minimize
 * @property {JSONOptions=} minimizerOptions Options for JSON minimization
 */
/**
 * @typedef {BasePluginOptions} PluginOptions
 */
declare class JsonMinimizerPlugin {
  /**
   * Build an error message for JSON minimization failures
   * @param {unknown} error The error that occurred
   * @param {string} file The file being processed
   * @param {string} context The compilation context
   * @returns {Error} Formatted error message
   */
  static buildError(error: unknown, file: string, context: string): Error;
  /**
   * Create a new JsonMinimizerPlugin instance
   * @param {PluginOptions} options Plugin configuration options
   */
  constructor(options?: PluginOptions);
  /**
   * @type {PluginOptions}
   */
  options: PluginOptions;
  /**
   * Optimize assets by minimizing JSON files
   * @param {Compiler} compiler The webpack compiler instance
   * @param {Compilation} compilation The webpack compilation instance
   * @param {Record<string, import("webpack").sources.Source>} assets The assets to process
   * @returns {Promise<void>} Promise that resolves when optimization is complete
   */
  optimize(
    compiler: Compiler,
    compilation: Compilation,
    assets: Record<string, import("webpack").sources.Source>,
  ): Promise<void>;
  /**
   * Apply the plugin to the webpack compiler
   * @param {Compiler} compiler The webpack compiler instance
   * @returns {void}
   */
  apply(compiler: Compiler): void;
}
declare namespace JsonMinimizerPlugin {
  export {
    Schema,
    Compiler,
    Compilation,
    Asset,
    WebpackError,
    Rule,
    Rules,
    JSONOptions,
    BasePluginOptions,
    MinimizedResult,
    InternalOptions,
    PluginOptions,
  };
}
type Schema = import("schema-utils/declarations/validate").Schema;
type Compiler = import("webpack").Compiler;
type Compilation = import("webpack").Compilation;
type Asset = import("webpack").Asset;
type WebpackError = import("webpack").WebpackError;
type Rule = RegExp | string;
type Rules = Rule[] | Rule;
type JSONOptions = {
  /**
   * JSON replacer function or array
   */
  replacer?:
    | ((
        this: unknown,
        key: string,
        value: unknown,
      ) => unknown | (number | string)[] | null)
    | undefined;
  /**
   * JSON space parameter for formatting
   */
  space?: (string | number) | undefined;
};
type BasePluginOptions = {
  /**
   * Test pattern for matching files
   */
  test?: Rule | undefined;
  /**
   * Include pattern for files
   */
  include?: Rule | undefined;
  /**
   * Exclude pattern for files
   */
  exclude?: Rule | undefined;
  /**
   * Options for JSON minimization
   */
  minimizerOptions?: JSONOptions | undefined;
};
type MinimizedResult = {
  /**
   * The minimized JSON code
   */
  code: string;
};
type InternalOptions = {
  /**
   * The input JSON string to minimize
   */
  input: string;
  /**
   * Options for JSON minimization
   */
  minimizerOptions?: JSONOptions | undefined;
};
type PluginOptions = BasePluginOptions;
