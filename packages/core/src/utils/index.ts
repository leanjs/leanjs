export * from "./loadScript";
export * from "./loadModule";

export const createValidJSVarName = (str: string) =>
  `_${str.replace(/[^a-z0-9+]+/gi, "")}`;

export const defaultProxyPort = 56560;

export const getProxyUrl = ({
  port = defaultProxyPort,
  packageName,
}: {
  packageName: string;
  port?: number;
}) => `http://localhost:${port}/proxy/${encodeURIComponent(packageName)}`;
