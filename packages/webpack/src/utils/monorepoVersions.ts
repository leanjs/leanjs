import fg from "fast-glob";
import { readFile } from "fs/promises";
import { findRootConfigSync } from "@leanjs/cli";

import type { DependencyVersion } from "../types";
import { mergeDependencyVersions } from "./dependencies";

const maxRecursion = 4;

export async function findMonorepoVersions() {
  let monororepoVersions = {};

  const { packageJson: rootPackageJson, absolutePath } = findRootConfigSync({
    maxRecursion,
  });

  const workspaces = Array.isArray(rootPackageJson?.workspaces)
    ? rootPackageJson?.workspaces
    : rootPackageJson?.workspaces?.packages;

  let workspacesFilter = "";
  if (workspaces?.length) {
    workspacesFilter =
      workspaces.length > 1
        ? `/(${workspaces?.join("|")})`
        : `/${workspaces[0]}`;
  }

  if (absolutePath) {
    const monorepoPackagePaths = fg.sync(
      `${absolutePath}${workspacesFilter}/**/package.json`,
      {
        absolute: true,
        ignore: [`**/node_modules/**`],
        deep: maxRecursion,
      }
    );

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
