import fg from "fast-glob";
import { readFile } from "fs/promises";
import { findRootConfigSync } from "@leanjs/cli";

import type { DependencyVersion } from "../types";
import { mergeDependencyVersions } from "./dependencies";

const maxRecursion = 4;

interface FindMonorepoVersionsArgs {
  sharedExcludeFolders?: string;
}
export async function findMonorepoVersions({
  sharedExcludeFolders,
}: FindMonorepoVersionsArgs = {}) {
  let monororepoVersions = {};

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
    if (sharedExcludeFolders) {
      ignore.push(sharedExcludeFolders);
    }

    const monorepoPackagePaths = fg.sync(filters, {
      absolute: true,
      ignore,
      deep: maxRecursion,
    });

    const monorepoPackageVersions = await readPackageVersions(
      monorepoPackagePaths
    );

    monororepoVersions = mergeDependencyVersions(
      rootPackageJson?.dependencies,
      monorepoPackageVersions
    );
  }

  return monororepoVersions;
}

export async function readPackageVersions(packagePaths: string[]) {
  let depVersions: DependencyVersion = {};
  try {
    const fileContents = await Promise.all(
      packagePaths.map((packagePath) => readFile(packagePath, "utf8"))
    );

    depVersions = fileContents.reduce((accDeps, content) => {
      const jsonContent = JSON.parse(content);
      if (jsonContent?.name) {
        accDeps[jsonContent?.name] = jsonContent?.version;
      }

      return accDeps;
    }, depVersions);
  } catch (error) {
    console.log(
      `🔥 Failed to read package versions of the following files`,
      packagePaths,
      error
    );
  }

  return depVersions;
}
