process.env.NODE_ENV = "production";

import chalk from "chalk";
import { readdirSync } from "fs-extra";
import { _ as CoreUtils } from "@leanjs/core";

import { getPackageInfo } from "../utils/packageJson";
import { createCommand, exitError } from "../utils/command";
import { getOutputPath } from "../utils/path";
import { findRootConfigSync } from "../utils/leanConfig";

const { getRemoteBasename } = CoreUtils;

const command = createCommand();
command
  .option(
    "-u, --use <type>",
    "Name of the provider where you want to deploy your micro-frontend"
  )
  .option(
    "-d, --distFolder <type>",
    "Name of the folder that contains the assets to be deployed"
  );

command.parse(process.argv);

const { packageName, packageVersion } = getPackageInfo();
const { leanConfig } = findRootConfigSync();
const outputPath = getOutputPath();

if (!(readdirSync(outputPath)?.length > 0)) {
  exitError(
    `${chalk.cyan(outputPath)} has not files to deploy. Did you run build?`
  );
}

const { use, distFolder = "dist" } = command.opts();
const deploymentPackageName = use ?? leanConfig?.command?.deploy?.use;
if (!deploymentPackageName) {
  exitError(
    `you must set command deploy ${chalk.cyan(
      "use"
    )} option in the cli (e.g. lean deploy --use=@leanjs/aws) or in lean.config.js`
  );
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const provider = require(deploymentPackageName);

if (!provider) {
  exitError(
    `Package ${chalk.cyan(
      deploymentPackageName
    )} was not found. Did you install it?`
  );
}

if (!provider.deploy) {
  exitError(
    `Package ${chalk.cyan(
      deploymentPackageName
    )} has no exported member ${chalk.cyan("deploy")}`
  );
}

const version = process.env.VERSION ?? packageVersion;
if (!version) {
  exitError(`${chalk.cyan("version")} is required.`);
}

console.log(
  `Deploying ${chalk.cyan(packageName)} using ${chalk.cyan(
    deploymentPackageName
  )}`
);

provider
  .deploy({
    distFolder,
    basename: getRemoteBasename({ packageName, version }),
    packageName,
    version,
  })
  .then(() => {
    console.log(
      `${chalk.cyan(packageName)} ${chalk.green("successfully deployed")}`
    );
  })
  .catch((error: Error) => {
    exitError(`${packageName} deployment failed`, error);
  });
