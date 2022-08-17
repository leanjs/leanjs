import { Compiler, WebpackPluginInstance, container } from "webpack";
import type { SharedDependencies, AutoShared } from "../types";
import {
  getImplicitlySharedDependencies,
  formatSharedDependencies,
} from "../utils/dependencies";
export interface HostWebpackOptions {
  shared?: SharedDependencies;
  autoShared?: AutoShared | boolean;
  eager?: boolean;
  remotes?: {
    packages: string[];
  };
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
    const enabledRemotePackages = this.options.remotes?.packages;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(`${process.cwd()}/package.json`);
    const implicitDependencies = getImplicitlySharedDependencies({
      autoShared,
      packageName: packageJson.name,
      enabledRemotePackages,
    });

    const remotes = enabledRemotePackages?.reduce((acc, remote) => {
      acc[remote] = `promise new Promise((resolve) => {
        resolve({
            get: () => () => ({ packageName: "${remote}" }),
        });
      })`;

      return acc;
    }, {} as Record<string, string>);

    new ModuleFederationPlugin({
      shared: formatSharedDependencies({
        eager,
        explicitDependencies,
        implicitDependencies,
      }),
      remotes,
    }).apply(compiler);
  }
}
