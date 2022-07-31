import { Configuration } from "webpack";

export type DependencyVersion = Record<string, string>;

export interface SharedDependencies {
  /**
   * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
   */
  eager?: boolean;

  /**
   * Version requirement from module in share scope.
   */
  requiredVersion?: string | false;

  /**
   * Allow only a single version of the shared module in share scope (disabled by default).
   */
  singleton?: boolean;

  /**
   * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
   */
  strictVersion?: boolean;

  /**
   * Version of the provided module. Will replace lower matching versions, but not higher.
   */
  version?: string | false;
}

interface WebpackConfigArgs {
  port: number;
}
type WebpackConfigFn = ({ port }: WebpackConfigArgs) => Configuration;

export interface LeanConfig {
  devServer: {
    port: number;
  };
  webpack: Record<string, Configuration | WebpackConfigFn> | undefined;
}
