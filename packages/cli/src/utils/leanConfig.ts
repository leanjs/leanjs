import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

import type { LeanConfig, LeanWebpackConfig } from "../types";

interface CreateFindRootConfigSyncArgs {
  maxRecursion?: number;
  currentWorkingDir?: string;
}
interface RootConfig {
  leanConfig?: LeanConfig;
  packageJson?: {
    dependencies?: Record<string, string>;
    workspaces?: string[] | { packages: string[] };
  };
  absolutePath?: string;
}

const filename = "lean.config.js";

export function findRootConfigSync({
  maxRecursion = 4,
  currentWorkingDir = process.cwd(),
}: CreateFindRootConfigSyncArgs = {}) {
  let file: RootConfig;
  function findParentFileSync(relativePath = "."): RootConfig {
    if (file) {
      return file;
    } else if (
      maxRecursion === 0 ||
      path.resolve(currentWorkingDir, relativePath) === "/"
    ) {
      return {};
    }

    maxRecursion--;
    const fullpathLeanConfig = path.join(
      currentWorkingDir,
      relativePath,
      filename
    );
    const exists = fs.existsSync(fullpathLeanConfig);

    if (exists) {
      const rootPackageJsonPath = path.join(
        currentWorkingDir,
        relativePath,
        "package.json"
      );
      const rootPackageJsonExists = fs.existsSync(rootPackageJsonPath);
      file = {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        leanConfig: require(fullpathLeanConfig),
        packageJson: rootPackageJsonExists
          ? // eslint-disable-next-line @typescript-eslint/no-var-requires
            require(rootPackageJsonPath)
          : undefined,
        absolutePath: path.join(currentWorkingDir, relativePath),
      };
      return file;
    } else {
      return findParentFileSync(path.join("..", relativePath));
    }
  }

  return findParentFileSync();
}

interface GetWebpackConfigArgs {
  webpack?: LeanWebpackConfig;
  configName: string;
  packageName: string;
  port?: number;
}

export function getWebpackConfig({
  webpack,
  configName,
  packageName,
  port,
}: GetWebpackConfigArgs) {
  const functionOrObjectConfig = webpack?.[configName];
  if (!functionOrObjectConfig) {
    console.log(
      chalk.red(
        `No webpack config found in lean.config.js for ${chalk.cyan(
          configName
        )} in package: ${chalk.cyan(packageName)}`
      )
    );
    process.exit(1);
  }

  return typeof functionOrObjectConfig === "function"
    ? functionOrObjectConfig({ port })
    : functionOrObjectConfig;
}
