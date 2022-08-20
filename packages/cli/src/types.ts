import { Configuration } from "webpack";

interface WebpackConfigArgs {
  port?: number;
}
type WebpackConfigFn = ({ port }: WebpackConfigArgs) => Configuration;

export type LeanWebpackConfig =
  | Record<string, Configuration | WebpackConfigFn>
  | undefined;

interface LeanCommand {
  deploy?: {
    use: string;
  };
}
export interface LeanConfig {
  devServer: {
    port: number;
  };
  selfHosted: {
    createRuntimePackage: string;
  };
  webpack: LeanWebpackConfig;
  command?: LeanCommand;
}
