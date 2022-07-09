import path, { resolve } from "path";
import { readdir } from "fs/promises";
import chalk from "chalk";
import type { RemoteTarget } from "@leanjs/core";

interface GetOutputPathArgs {
  target?: RemoteTarget;
  distPath?: string;
}
export const getOutputPath = ({
  target = "browser",
  distPath = "dist",
}: GetOutputPathArgs = {}) => {
  return `${path.join(process.cwd(), distPath, target)}`;
};

export const generateSemanticPathname = (version: string) => {
  const segments = version.split(".");
  if (segments.length !== 3) {
    throw new Error(
      `${chalk.red(
        version
      )} is not a proper semantic version. Expected "x.y.z", for instance 1.2.3`
    );
  }

  return {
    minor: `@^${segments[0]}`,
    patch: `@~${segments[0]}.${segments[1]}`,
    major: "",
  };
};

// copied from https://stackoverflow.com/a/45130990/4842303
export async function* readFilePaths(dir: string): AsyncGenerator<string> {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* readFilePaths(res);
    } else {
      yield res;
    }
  }
}
