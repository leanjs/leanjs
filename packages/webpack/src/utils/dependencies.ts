import { getMonorepoDependencies } from "./getMonorepoDependencies";
import type {
  Dependencies,
  AutoShared,
  SharedDependency,
  SharedDependencies,
} from "../types";

export function mergeDependencies(
  overridable: Dependencies = {},
  nonoverridable: Dependencies
): Dependencies {
  return Object.keys(nonoverridable).reduce((accVersions, name) => {
    if (nonoverridable[name]) {
      accVersions[name] = nonoverridable[name];
    }

    return accVersions;
  }, overridable);
}

interface SharedDependenciesArgs {
  dependencies?: Dependencies;
  peerDependencies?: Dependencies;
  monorepoDependencies?: Dependencies;
}
export function versionSharedDependencies({
  dependencies = {},
  peerDependencies,
  monorepoDependencies = {},
}: SharedDependenciesArgs) {
  const packageDependencies = mergeDependencies(peerDependencies, dependencies);

  const shared: Dependencies = {};
  Object.keys(packageDependencies).forEach((name) => {
    if (monorepoDependencies[name]) {
      if (packageDependencies[name] === "*") {
        shared[name] = monorepoDependencies[name];
      } else {
        shared[name] = packageDependencies[name];
      }
    }
  });

  return shared;
}

interface FilterDependenciesArgs {
  dependencies: Dependencies;
  excludeDependencies?: string[];
}
export function filterDependencies({
  dependencies,
  excludeDependencies,
}: FilterDependenciesArgs) {
  if (excludeDependencies?.length) {
    const excludeSet = new Set(excludeDependencies);

    return Object.keys(dependencies).reduce((acc, packageName) => {
      if (!excludeSet.has(packageName)) {
        acc[packageName] = dependencies[packageName];
      }
      return acc;
    }, {} as Dependencies);
  } else {
    return dependencies;
  }
}

// getImplicitlySharedDependencies is for monorepos setups
interface GetImplicitlySharedDependenciesArgs {
  autoShared?: AutoShared | boolean;
  packageJson: Record<string, any>;
}
export function getImplicitlySharedDependencies({
  autoShared,
  packageJson,
}: GetImplicitlySharedDependenciesArgs) {
  if (autoShared === false) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const packageJson = require(`${process.cwd()}/package.json`);
  let excludeDirPattern: string | undefined,
    excludePackages: string[] | undefined;
  if (typeof autoShared === "object") {
    excludeDirPattern = autoShared?.excludeDirPattern;
    excludePackages = autoShared?.excludePackages;
  }

  const monorepoDependencies = getMonorepoDependencies({
    packageName: packageJson.name,
    excludeDirPattern,
  });

  const filteredMonorepoDependencies = filterDependencies({
    dependencies: monorepoDependencies,
    excludeDependencies: excludePackages,
  });

  const packageSharedDependencies = versionSharedDependencies({
    dependencies: packageJson.dependencies,
    peerDependencies: packageJson.peerDependencies,
    monorepoDependencies: filteredMonorepoDependencies,
  });

  return {
    ...filteredMonorepoDependencies,
    ...packageSharedDependencies,
  };
}

interface FormatSharedDependenciesArgs {
  eager?: boolean;
  explicitDependencies: SharedDependencies;
  implicitDependencies?: Dependencies;
}
export function formatSharedDependencies({
  eager,
  explicitDependencies,
  implicitDependencies,
}: FormatSharedDependenciesArgs) {
  const formattedExplicitDependencies = Object.keys(
    explicitDependencies
  ).reduce((formattedExplicitlyShared, name) => {
    let expValue = explicitDependencies[name];
    if (
      implicitDependencies &&
      typeof expValue === "object" &&
      !expValue.requiredVersion
    ) {
      // update explicit dependency version with implicit dependency version if no explicit dependency version
      expValue.requiredVersion = implicitDependencies[name];
    }

    if (eager !== undefined) {
      if (typeof expValue === "object") {
        expValue.eager = expValue.eager ?? eager;
      } else {
        (expValue as SharedDependency) = {
          eager,
          requiredVersion: expValue,
        };
      }
    }

    formattedExplicitlyShared[name] = expValue;

    return formattedExplicitlyShared;
  }, {} as SharedDependencies);

  let formattedImplicitDependencies:
    | Dependencies
    | SharedDependencies
    | undefined = implicitDependencies;
  if (eager !== undefined && implicitDependencies) {
    formattedImplicitDependencies = Object.keys(implicitDependencies).reduce(
      (acc, name) => {
        acc[name] = {
          requiredVersion: implicitDependencies[name],
          eager,
        };
        return acc;
      },
      {} as SharedDependencies
    );
  }

  return {
    ...formattedImplicitDependencies,
    ...formattedExplicitDependencies,
  };
}
