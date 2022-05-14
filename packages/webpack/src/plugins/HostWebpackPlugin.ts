import { Compiler, WebpackPluginInstance, container } from "webpack";
import type { SharedDependencies } from "./types";

export interface HostWebpackInternalOptions {
  shared: Record<string, string | SharedDependencies>;
  shareAll?: boolean;
}

const { ModuleFederationPlugin } = container;

export class HostWebpackPlugin implements WebpackPluginInstance {
  private options: HostWebpackInternalOptions;

  constructor(options: HostWebpackInternalOptions) {
    this.options = options || {};
  }

  apply(compiler: Compiler) {
    const { shared = {}, shareAll = false } = this.options;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(`${process.cwd()}/package.json`);

    new ModuleFederationPlugin({
      shared: {
        ...(shareAll ? packageJson.dependencies : {}),
        ...shared,
      },
    }).apply(compiler);
  }
}
