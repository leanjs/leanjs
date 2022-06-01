import chalk from "chalk";
import * as fs from "fs";

export function getPackageName(fullpath = process.cwd()) {
  const packageJsonFullPath = `${fullpath}/package.json`;
  if (!fs.existsSync(packageJsonFullPath)) {
    console.error(
      chalk.red(`No package.json found in path: ${chalk.cyan(fullpath)}`)
    );
    process.exit(1);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(packageJsonFullPath);
  const packageName = packageJson.name as string | undefined;
  if (!packageName) {
    console.error(
      chalk.red(
        `No package name found in package.json. Path: ${fullpath}/package.json`
      )
    );
    process.exit(1);
  }

  return packageName;
}
