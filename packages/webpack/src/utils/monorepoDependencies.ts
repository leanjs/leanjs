import fg from "fast-glob";
import { readFile } from "fs/promises";
import { findRootConfigSync } from "@leanjs/cli";

import type { Dependencies } from "../types";
import { mergeDependencies } from "./dependencies";

const maxRecursion = 4;

interface FindMonorepoVersionsArgs {
  excludeDirPattern?: string;
  enabledRemotePackages?: Set<string>;
}
export async function findMonorepoDependencies({
  excludeDirPattern,
  enabledRemotePackages,
}: FindMonorepoVersionsArgs = {}) {
  let rootAndPackagesDependencies: Dependencies = {};
  let dependenciesOfRemotes: Dependencies = {};

  const { packageJson: rootPackageJson, absolutePath } = findRootConfigSync({
    maxRecursion,
  });

  const workspaces = Array.isArray(rootPackageJson?.workspaces)
    ? rootPackageJson?.workspaces
    : rootPackageJson?.workspaces?.packages;

  if (absolutePath) {
    let filters: string[] | string;
    if (workspaces?.length) {
      filters = workspaces.reduce((acc, workspace) => {
        acc.push(
          `${absolutePath}/${workspace.replace("/*", "")}/**/package.json`
        );

        return acc;
      }, [] as string[]);
    } else {
      filters = `${absolutePath}/**/package.json`;
    }

    const ignore = [`**/node_modules/**`];
    if (excludeDirPattern) {
      ignore.push(excludeDirPattern);
    }

    const monorepoPackagePaths = fg.sync(filters, {
      absolute: true,
      ignore,
      deep: maxRecursion,
    });

    const packages = await readPackages(
      monorepoPackagePaths,
      enabledRemotePackages
    );

    dependenciesOfRemotes = packages.dependenciesOfRemotes;
    rootAndPackagesDependencies = mergeDependencies(
      rootPackageJson?.dependencies,
      packages.localDependencies
    );
  }

  return { rootAndPackagesDependencies, dependenciesOfRemotes };
}

export async function readPackages(
  packagePaths: string[],
  enabledRemotePackages?: Set<string>
) {
  let localDependencies: Dependencies = {};
  let dependenciesOfRemotes: Dependencies = {};

  try {
    const fileContents = await Promise.all(
      packagePaths.map(async (packagePath) => ({
        packagePath,
        content: await readFile(packagePath, "utf8"),
      }))
    );

    localDependencies = fileContents.reduce(
      (accDeps, { content, packagePath }) => {
        let jsonContent;
        try {
          jsonContent = JSON.parse(content);
        } catch (error) {
          console.log(`failed to read JSON file ${packagePath}`);
        }

        if (!jsonContent) {
          return accDeps;
        }

        if (jsonContent.name) {
          accDeps[jsonContent.name] = jsonContent.version;
        }

        if (enabledRemotePackages?.has(jsonContent.name)) {
          dependenciesOfRemotes = {
            ...dependenciesOfRemotes,
            ...jsonContent.peerDependencies,
            ...jsonContent.dependencies,
          };
        }

        return accDeps;
      },
      localDependencies
    );
  } catch (error) {
    console.log(
      `🔥 Failed to read package versions of the following files`,
      packagePaths,
      error
    );
  }

  return { localDependencies, dependenciesOfRemotes };
}
