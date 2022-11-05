import type { RemoteTarget, AppError } from "../types";

export * from "./loadScript";
export * from "./loadModule";
export * from "./createMount";

export const createRemoteName = (packageName: string) =>
  `_${packageName.replace(/[^a-z0-9+]+/gi, "_")}`;

interface GetRemoteUrl {
  origin: string;
  packageName: string;
  version?: string;
  target?: RemoteTarget;
}

export const isError = (error: any): error is Error =>
  error?.stack !== undefined && error?.message !== undefined;

export const createAppError = ({
  error,
  appName,
  version,
}: {
  error: any;
  appName?: string;
  version?: string;
}) => {
  let appError: AppError = error;

  if (!isError(error)) {
    appError = new Error(error ? error.toString() : "unknown");
  }

  if (appName) {
    appError.name = `${appError.name}::${appName}`;
    appError.appName = appName;
  }
  if (version) {
    appError.name = `${appError.name}::${version}`;
    appError.version = version;
  }

  return appError;
};

export const deleteTrailingSlash = (str: string) => str.replace(/\/+$/g, "");

export const dedupeSlash = (str: string) => str.replace(/\/{2,}/g, "/");

export const getRemoteUrl = ({
  origin,
  packageName,
  version = "latest",
  target = "browser",
}: GetRemoteUrl) =>
  `${deleteTrailingSlash(origin)}${getRemoteBasename({
    packageName,
    version,
  })}/${target}/remoteEntry.js`;

export interface GetRemotePathArgs {
  packageName: string;
  version: string;
}

export function getRemoteBasename({ packageName, version }: GetRemotePathArgs) {
  return `/${createRemoteName(packageName)}/${version}`;
}

export const isPromise = (arg?: any): arg is Promise<any> =>
  ({}.toString.call(arg) === "[object Promise]");

export const isObject = (data: any) =>
  ({}.toString.call(data) === "[object Object]");
