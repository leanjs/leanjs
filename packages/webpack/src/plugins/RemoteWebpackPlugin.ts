import { _ as CoreUtils } from "@leanjs/core";
import { startDevProxyServer } from "@leanjs/cli";
import { Compiler, WebpackPluginInstance, container } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import VirtualModulesPlugin from "webpack-virtual-modules";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { execFileSync } from "child_process";

import { ModuleScopePlugin } from "./ModuleScopePlugin";
import type { DependencyVersion, SharedDependencies } from "../types";
import { versionDependencies } from "../utils/dependencies";

const { createRemoteName } = CoreUtils;
export interface RemoteWebpackOptions {
  shared?: Record<string, string | SharedDependencies>;
}

const { ModuleFederationPlugin } = container;

export class RemoteWebpackPlugin implements WebpackPluginInstance {
  private options: RemoteWebpackOptions;

  constructor(options?: RemoteWebpackOptions) {
    this.options = options ?? {};
  }

  apply(compiler: Compiler) {
    const isEnvDevelopment = process.env.NODE_ENV === "development";
    const isEnvProduction = process.env.NODE_ENV === "production";
    const { extensions } = compiler.options.resolve;
    const remoteExists = (
      extensions?.length ? extensions : [".ts", ".js"]
    ).reduce(
      (acc, ext) => acc || fs.existsSync(`${process.cwd()}/src/remote${ext}`),
      false
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(`${process.cwd()}/package.json`);
    const packageName = packageJson.name as string | undefined;
    const remoteAppPort = compiler.options.devServer?.port;
    if (!isEnvProduction && !remoteAppPort) {
      throw Error(
        `Webpack config devServer needs a port. More info https://webpack.js.org/configuration/dev-server/#devserverport`
      );
    }
    if (!packageName) {
      throw new Error(`No package name found in package.json`);
    }
    if (!remoteExists) {
      console.log(
        `⚠️ No src/remote.ts|js found. Exiting RemoteWebpackPlugin for ${chalk.cyan(
          packageName
        )}`
      );

      process.exit(1);
    }

    if (isEnvDevelopment) {
      compiler.options.devServer = {
        ...compiler.options.devServer,
        historyApiFallback: {
          ...compiler.options.devServer?.historyApiFallback,
          index: `/index.html`,
        },
        headers: {
          ...compiler.options.devServer?.headers,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-Requested-With, content-type, Authorization",
        },
      };

      startDevProxyServer()
        .then(({ api }) =>
          api.updatePackagePort(packageName, compiler.options.devServer?.port)
        )
        .catch((err) => {
          throw new Error(err);
        });
    }

    const moduleName = createRemoteName(packageName);
    const indexHtmlPath = path.resolve(process.cwd(), "public/index.html");
    const indexHtml = fs.readFileSync(
      fs.existsSync(indexHtmlPath)
        ? indexHtmlPath
        : path.resolve(__dirname, "../index.html"),
      "utf8"
    );
    const html = indexHtml
      .replace(`<body>`, `<body><div id="${packageName}"></div>`)
      .replace(`<title></title>`, `<title>${packageName}</title>`);

    compiler.options.resolve = {
      ...compiler.options.resolve,
      plugins: [
        ...(compiler.options.resolve.plugins ?? []),
        new ModuleScopePlugin(),
      ],
    };

    const publicPath =
      process.env.PUBLIC_PATH ?? compiler.options.output.publicPath;
    compiler.options.output = {
      ...compiler.options.output,
      ...(isEnvProduction && publicPath ? { publicPath } : {}),
      assetModuleFilename:
        compiler.options.output.assetModuleFilename ??
        "static/media/[name].[hash][ext]",
    };

    // We run execFileSync because the Webpack `apply` method is synchronous and
    // here we want to asynchronously read multiple files if we are in a monorepo.
    // We are not using async Webpack hooks because there is no async hook to modify
    // the Webpack config before ModuleFederationPlugin is applied (as far as I know).
    // To improve performance, we asynchronously read files in the repo inside the following script.
    // We need to synchronously wait for the end of the execution of the script because of this sync `apply` method
    const monorepoVersions = execFileSync("node", [
      `${__dirname}/../scripts/stdoutWriteMonorepoVersions.js`,
    ]);

    let sharedDependencies: DependencyVersion = {};
    try {
      sharedDependencies = JSON.parse(monorepoVersions.toString());
    } catch (error) {
      console.log(
        `🔥 Failed to read shared dependencies of ${packageName}. Building with no shared dependencies`,
        error
      );
    }

    const shared = versionDependencies({
      dependencies: packageJson.dependencies,
      peerDependencies: packageJson.peerDependencies,
      sharedDependencies,
    });

    new ModuleFederationPlugin({
      name: moduleName,
      filename: "remoteEntry.js",
      exposes: {
        ".": "./src/remote",
      },
      shared: {
        ...shared, // TODO write test to assert shared were added to the output of the build
        ...(this.options.shared || {}),
      },
    }).apply(compiler);

    new VirtualModulesPlugin({
      "./src/index.js": `import("./bootstrap");`,
      "./src/bootstrap": fs.readFileSync(
        path.resolve(__dirname, "../bootstrap.js"),
        "utf8"
      ),
      "./public/index.html": html,
    }).apply(compiler);

    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }).apply(compiler);
  }
}
