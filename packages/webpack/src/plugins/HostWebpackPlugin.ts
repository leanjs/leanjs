import { Compiler, WebpackPluginInstance, container } from "webpack";
import type { DependencyVersion, SharedDependencies } from "../types";
import { getSharedDependencies } from "../utils/getSharedDependencies";

export interface HostWebpackOptions {
  shared: Record<string, string | SharedDependencies>;
  eager?: boolean;
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
    const { eager } = this.options;
    const { packageDependencies, monorepoDependencies } = getSharedDependencies(
      {
        packageName: packageJson.name,
        dependencies: packageJson.dependencies,
        peerDependencies: packageJson.peerDependencies,
      }
    );

    const implicitlyShared = {
      ...monorepoDependencies,
      ...packageDependencies,
    };

    const formattedExplicitlyShared = Object.keys(explicitlyShared).reduce(
      (formattedExplicitlyShared, name) => {
        const expValue = explicitlyShared[name];
        if (
          typeof expValue === "object" &&
          !expValue.version &&
          !expValue.requiredVersion
        ) {
          // update explicit dependency version with implicit dependency version if no explicit dependency version
          expValue.requiredVersion = implicitlyShared[name];
        }

        if (eager !== undefined) {
          if (typeof expValue === "object") {
            expValue.eager = expValue.eager ?? eager;
          } else {
            (expValue as SharedDependencies) = {
              eager,
              requiredVersion: expValue,
            };
          }
        }

        formattedExplicitlyShared[name] = expValue;

        return formattedExplicitlyShared;
      },
      {} as Record<string, SharedDependencies | string>
    );

    let formattedImplicitlyShared:
      | DependencyVersion
      | Record<string, SharedDependencies> = implicitlyShared;
    if (eager !== undefined) {
      formattedImplicitlyShared = Object.keys(implicitlyShared).reduce(
        (acc, name) => {
          acc[name] = {
            requiredVersion: implicitlyShared[name],
            eager,
          };
          return acc;
        },
        {} as Record<string, SharedDependencies>
      );
    }

    new ModuleFederationPlugin({
      shared: {
        ...formattedImplicitlyShared,
        ...formattedExplicitlyShared,
      },
    }).apply(compiler);
  }
}
