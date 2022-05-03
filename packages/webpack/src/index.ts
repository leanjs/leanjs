import { createValidJSVarName } from "@leanjs/core";
import { Compiler, WebpackPluginInstance, container } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import VirtualModulesPlugin from "webpack-virtual-modules";
import * as fs from "fs";
import * as path from "path";

import { InternalOptions } from "./types";

const { ModuleFederationPlugin } = container;

export class MicroFrontendWebpackPlugin implements WebpackPluginInstance {
  private options: InternalOptions;

  constructor(options: InternalOptions) {
    this.options = options || {};
  }

  apply(compiler: Compiler) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(`${process.cwd()}/package.json`);
    const { shared = {}, shareAllDependencies = true } = this.options;
    const packageName = packageJson.name;
    const moduleName = createValidJSVarName(packageName);
    const indexHtmlPath = path.resolve(process.cwd(), "public/index.html");
    const indexHtml = fs.readFileSync(
      fs.existsSync(indexHtmlPath)
        ? indexHtmlPath
        : path.resolve(__dirname, "index.html"),
      "utf8"
    );
    const html = indexHtml.replace(/%PACKAGE_NAME%/g, packageName);

    new ModuleFederationPlugin({
      name: moduleName,
      filename: "remoteEntry.js",
      exposes: {
        ".": "./src/micro",
      },
      shared: {
        ...(shareAllDependencies ? packageJson.dependencies : {}),
        ...shared,
      },
    }).apply(compiler);

    new VirtualModulesPlugin({
      "./src/index.js": `import("./bootstrap");`,
      "./src/bootstrap": fs.readFileSync(
        path.resolve(__dirname, "./bootstrap.js"),
        "utf8"
      ),
      "./public/index.html": html,
    }).apply(compiler);

    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }).apply(compiler);
  }
}
