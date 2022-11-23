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
  filterAndVersionBy?: Dependencies;
}
export function filterAndVersionDependencies({
  dependencies = {},
  filterAndVersionBy = {},
}: SharedDependenciesArgs) {
  const shared: Dependencies = {};
  Object.keys(dependencies).forEach((name) => {
    if (filterAndVersionBy[name]) {
      if (dependencies[name] === "*") {
        shared[name] = filterAndVersionBy[name];
      } else {
        shared[name] = dependencies[name];
      }
    }
  });

  return shared;
}

interface FilterDependenciesArgs {
  dependencies?: Dependencies;
  excludeDependencies?: string[];
}
export function filterDependencies({
  dependencies = {},
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
  packageName: string;
  dependencies?: Dependencies;
  peerDependencies?: Dependencies;
  enabledRemotePackages?: string[];
}
export function getImplicitlySharedDependencies({
  autoShared,
  packageName,
  dependencies = {},
  peerDependencies = {},
  enabledRemotePackages,
}: GetImplicitlySharedDependenciesArgs) {
  if (autoShared === false) {
    return undefined;
  }

  let excludeDirPattern: string | undefined,
    excludePackages: string[] | undefined;
  if (typeof autoShared === "object") {
    excludeDirPattern = autoShared?.excludeDirPattern;
    excludePackages = autoShared?.excludePackages;
  }

  const { rootAndPackagesDependencies, dependenciesOfRemotes } =
    getMonorepoDependencies({
      packageName,
      excludeDirPattern,
      enabledRemotePackages,
    });

  const filteredMonorepoDependencies = filterDependencies({
    dependencies: rootAndPackagesDependencies,
    excludeDependencies: excludePackages,
  });

  return filterAndVersionDependencies({
    dependencies: mergeDependencies(
      peerDependencies,
      mergeDependencies(dependenciesOfRemotes, dependencies)
    ),
    filterAndVersionBy: filteredMonorepoDependencies,
  });
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

  const sharedDependencies: SharedDependencies = {
    ...formattedImplicitDependencies,
    ...formattedExplicitDependencies,
  };
  const addDependencies: SharedDependencies = {};
  for (const key in sharedDependencies) {
    const version = sharedDependencies[key];
    if (key === "@leanjs/react") {
      addDependencies["@leanjs/react/18"] = version;
      addDependencies["@leanjs/react/17"] = version;
    } else if (key === "@leanjs/react-router") {
      addDependencies["@leanjs/react-router/18"] = version;
      addDependencies["@leanjs/react-router/17"] = version;
    }
  }

  return { ...sharedDependencies, ...addDependencies };
}
