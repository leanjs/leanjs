import type { DependencyVersion } from "../types";

export function mergeDependencyVersions(
  overridable: DependencyVersion = {},
  nonoverridable: DependencyVersion
) {
  return Object.keys(nonoverridable).reduce((accVersions, name) => {
    if (nonoverridable[name]) {
      accVersions[name] = nonoverridable[name];
    }

    return accVersions;
  }, overridable);
}

interface SharedDependenciesArgs {
  dependencies?: DependencyVersion;
  peerDependencies?: DependencyVersion;
  monorepoDependencies?: DependencyVersion;
}
export function versionDependencies({
  dependencies = {},
  peerDependencies,
  monorepoDependencies = {},
}: SharedDependenciesArgs) {
  const packageDependencies = mergeDependencyVersions(
    peerDependencies,
    dependencies
  );

  const shared: DependencyVersion = {};
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
