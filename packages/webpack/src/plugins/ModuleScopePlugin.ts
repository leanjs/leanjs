// https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/ModuleScopePlugin.js

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Resolver, ResolvePluginInstance } from "webpack";
import chalk from "chalk";
import * as os from "os";
import * as path from "path";
import { realpathSync } from "fs";

const appDirectory = realpathSync(process.cwd());

export class ModuleScopePlugin implements ResolvePluginInstance {
  private appSrcs: string[];
  private allowedFiles: Set<string>;

  constructor(appSrc = appDirectory, allowedFiles = []) {
    this.appSrcs = Array.isArray(appSrc) ? appSrc : [appSrc];
    this.allowedFiles = new Set(allowedFiles);
  }

  apply(resolver: Resolver) {
    const { appSrcs } = this;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver.hooks.file.tapAsync(
      "ModuleScopePlugin",
      (
        request: any,
        _contextResolver: never,
        callback: (error?: Error, requrest?: any) => void
      ): void => {
        // Unknown issuer, probably webpack internals
        if (!request.context.issuer) {
          return callback();
        }
        if (
          // If this resolves to a node_module, we don't care what happens next
          request.descriptionFileRoot.indexOf("/node_modules/") !== -1 ||
          request.descriptionFileRoot.indexOf("\\node_modules\\") !== -1 ||
          // Make sure this request was manual
          !request.__innerRequest_request
        ) {
          return callback();
        }
        // Resolve the issuer from our appSrc and make sure it's one of our files
        // Maybe an indexOf === 0 would be better?
        if (
          appSrcs.every((appSrc: string) => {
            const relative = path.relative(appSrc, request.context.issuer);
            // If it's not in one of our app src or a subdirectory, not our request!
            return relative.startsWith("../") || relative.startsWith("..\\");
          })
        ) {
          return callback();
        }
        const requestFullPath = path.resolve(
          path.dirname(request.context.issuer),
          request.__innerRequest_request
        );
        if (this.allowedFiles.has(requestFullPath)) {
          return callback();
        }
        // Find path from src to the requested file
        // Error if in a parent directory of all given appSrcs
        if (
          appSrcs.every((appSrc: string) => {
            const requestRelative = path.relative(appSrc, requestFullPath);

            const nodeModulesPath = requestFullPath.split("node_modules")[0];
            if (
              nodeModulesPath?.length > 0 &&
              appSrc.indexOf(nodeModulesPath) > -1
            ) {
              return false;
            }

            return (
              requestRelative.startsWith("../") ||
              requestRelative.startsWith("..\\")
            );
          })
        ) {
          const scopeError = new Error(
            `You attempted to import ${chalk.cyan(
              request.__innerRequest_request
            )} which falls outside of the directory of the micro-app. ` +
              `Relative imports outside of ${chalk.cyan(
                appDirectory
              )} are not supported.` +
              os.EOL +
              `You can either move that code inside ${chalk.cyan(
                appDirectory
              )}, or create a package.`
          );
          Object.defineProperty(scopeError, "__module_scope_plugin", {
            value: true,
            writable: false,
            enumerable: false,
          });
          return callback(scopeError, request);
        } else {
          return callback();
        }
      }
    );
  }
}
