import { Compiler, WebpackPluginInstance, container } from "webpack";
import type { SharedDependencies } from "../types";
import { getSharedDependencies } from "../utils/getSharedDependencies";

export interface HostWebpackOptions {
  shared: Record<string, string | SharedDependencies>;
}

const { ModuleFederationPlugin } = container;

export class HostWebpackPlugin implements WebpackPluginInstance {
  private options: HostWebpackOptions;

  constructor(options: HostWebpackOptions) {
    this.options = options || {};
  }

  apply(compiler: Compiler) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(`${process.cwd()}/package.json`);

    const shared = getSharedDependencies({
      packageName: packageJson.name,
      dependencies: packageJson.dependencies,
      peerDependencies: packageJson.peerDependencies,
    });

    new ModuleFederationPlugin({
      shared: {
        ...shared,
        ...this.options.shared,
      },
    }).apply(compiler);
  }
}
