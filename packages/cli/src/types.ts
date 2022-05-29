import { Configuration } from "webpack";

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
