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
    const explicitlyShared = this.options.shared || {};
    const implicitlyShared = getSharedDependencies({
      packageName: packageJson.name,
      dependencies: packageJson.dependencies,
      peerDependencies: packageJson.peerDependencies,
    });

    Object.keys(explicitlyShared).forEach((name) => {
      // update explicit dependency version with implicit dependency version if no explicit dependency
      const expValue = explicitlyShared[name];
      if (
        typeof expValue === "object" &&
        !expValue.version &&
        !expValue.requiredVersion
      ) {
        expValue.version = implicitlyShared[name];
      }
      explicitlyShared[name] = expValue;
    });

    new ModuleFederationPlugin({
      shared: {
        ...implicitlyShared,
        ...explicitlyShared,
      },
    }).apply(compiler);
  }
}
