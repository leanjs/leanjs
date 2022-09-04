import { RemoteTarget } from "../types";

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
