import { Compiler, WebpackPluginInstance, container } from "webpack";
import type { SharedDependencies, AutoShared, Dependencies } from "../types";
import {
  getImplicitlySharedDependencies,
  formatSharedDependencies,
} from "../utils/dependencies";
export interface HostWebpackOptions {
  shared?: SharedDependencies;
  autoShared?: AutoShared | boolean;
  eager?: boolean;
}

const { ModuleFederationPlugin } = container;

export class HostWebpackPlugin implements WebpackPluginInstance {
  private options: HostWebpackOptions;

  constructor(options: HostWebpackOptions) {
    this.options = options || {};
  }

  apply(compiler: Compiler) {
    const explicitDependencies = this.options.shared || {};
    const { eager, autoShared } = this.options;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(`${process.cwd()}/package.json`);
    const implicitDependencies = getImplicitlySharedDependencies({
      autoShared,
      packageJson,
    });

    new ModuleFederationPlugin({
      shared: formatSharedDependencies({
        eager,
        explicitDependencies,
        implicitDependencies,
      }),
    }).apply(compiler);
  }
}
