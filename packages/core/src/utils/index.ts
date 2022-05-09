export * from "./loadScript";
export * from "./loadModule";

export const createRemoteName = (str: string) =>
  `_${str.replace(/[^a-z0-9+]+/gi, "_")}`;

export const defaultProxyPort = 56560;

export const defaultOrigin = `http://localhost:${defaultProxyPort}/proxy`;

interface GetRemoteUrl {
  origin: string;
  packageName: string;
  version?: string;
}

export const deleteTrailingSlash = (str: string) => str.replace(/\/+$/g, "");

export const getRemoteUrl = ({
  origin,
  packageName,
  version = "latest",
}: GetRemoteUrl) =>
  `${deleteTrailingSlash(origin)}${getRemotePath({
    packageName,
    version,
  })}/remoteEntry.js`;

export interface GetRemotePathArgs {
  packageName: string;
  version: string;
}
export function getRemotePath({ packageName, version }: GetRemotePathArgs) {
  return `/${createRemoteName(packageName)}/${version}/web`;
}
