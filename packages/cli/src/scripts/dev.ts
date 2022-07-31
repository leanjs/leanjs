process.env.NODE_ENV = "development";

import createCompiler from "webpack";
import WebpackDevServer from "webpack-dev-server";
import chalk from "chalk";

import { getPackageInfo } from "../utils/packageJson";
import { startDevProxyServer } from "../utils/devProxyServer";
import { findRootConfigSync, getWebpackConfig } from "../utils/leanConfig";
import { createBundlerCommand, exitError } from "../utils/command";

const program = createBundlerCommand().option(
  "-p, --port <type>",
  "Port to run locally a given micro-frontend"
);

program.parse(process.argv);

async function dev() {
  const { packageName } = getPackageInfo();
  const { leanConfig } = findRootConfigSync();
  if (!leanConfig) {
    exitError(chalk.red(`No lean.config.js found.`));
  }
  try {
    console.log(
      `Starting development environment for ${chalk.cyan(packageName)}`
    );
    const { config: configName, port: customPort } = program.opts();
    const { api } = await startDevProxyServer();
    const port = customPort ?? (await api.generatePackagePort(packageName));

    // Abstract away the following Webpack code when we support more bundlers
    const webpackConfig = getWebpackConfig({
      webpack: leanConfig?.webpack,
      packageName,
      configName,
      port,
    });
    const { historyApiFallback } = webpackConfig.devServer || {};
    webpackConfig.devServer = {
      historyApiFallback: {
        ...(historyApiFallback === "object" ? historyApiFallback : {}),
        index: `/index.html`,
      },
      port: webpackConfig.devServer?.port ?? port,
    };
    const compiler = createCompiler(webpackConfig);
    const devServer = new WebpackDevServer(webpackConfig.devServer, compiler);

    devServer.start();

    ["SIGINT", "SIGTERM"].forEach(function (sig) {
      process.on(sig, () => {
        devServer?.close();
        process.exit();
      });
    });

    if (process.env.CI !== "true") {
      // Gracefully exit when stdin ends
      process.stdin.on("end", () => {
        devServer?.close();
        process.exit();
      });
    }
  } catch (error: unknown) {
    exitError(
      `dev command failed for ${chalk.cyan(packageName)}`,
      error as Error
    );
  }
}

dev();
