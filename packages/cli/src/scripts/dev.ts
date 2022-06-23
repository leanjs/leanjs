process.env.NODE_ENV = "development";

import createCompiler from "webpack";
import WebpackDevServer from "webpack-dev-server";
import chalk from "chalk";
import * as os from "os";

import { getPackageName } from "../utils/packageJson";
import { startDevProxyServer } from "../utils/devProxyServer";
import { findLeanConfigSync, getWebpackConfig } from "../utils/leanConfig";
import { createCommand } from "../utils/command";

const program = createCommand().option(
  "-p, --port <type>",
  "Port to run locally a given micro-frontend"
);

program.parse(process.argv);

async function dev() {
  const packageName = getPackageName();
  const leanConfig = findLeanConfigSync();
  if (!leanConfig) {
    console.log(chalk.red(`No lean.config.js found.`));
    process.exit(1);
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
  } catch (error: any) {
    console.log(
      `🔥 dev command failed for ${chalk.cyan(packageName)}:${os.EOL}${
        error?.message || error
      }`
    );

    process.exit(1);
  }
}

dev();
