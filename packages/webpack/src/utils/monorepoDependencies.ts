import fg from "fast-glob";
import { readFile } from "fs/promises";
import { findRootConfigSync } from "@leanjs/cli";

import type { Dependencies } from "../types";
import { mergeDependencies } from "./dependencies";

const maxRecursion = 4;

interface FindMonorepoVersionsArgs {
  excludeDirPattern?: string;
}
export async function findMonorepoDependencies({
  excludeDirPattern,
}: FindMonorepoVersionsArgs = {}) {
  let monororepoDependencies: Dependencies = {};

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

    const monorepoPackageVersions = await readPackageVersions(
      monorepoPackagePaths
    );

    monororepoDependencies = mergeDependencies(
      rootPackageJson?.dependencies,
      monorepoPackageVersions
    );
  }

  return monororepoDependencies;
}

export async function readPackageVersions(packagePaths: string[]) {
  let depVersions: Dependencies = {};
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
