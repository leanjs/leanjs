import * as fs from "fs";
import * as path from "path";

import type { LeanConfig } from "../types";

const filename = "lean.config.js";
const currentWorkingDir = process.cwd();
let maxRecursion = 4;
let config: LeanConfig;

export default function findIn(relativePath = "."): LeanConfig | undefined {
  // TODO check that this cached config works with Turborepo. Does Turbo run each script in a separate process?
  if (config) {
    return config;
  } else if (
    maxRecursion === 0 ||
    path.resolve(currentWorkingDir, relativePath) === "/"
  ) {
    return undefined;
  }

  maxRecursion--;
  const fullpath = path.join(currentWorkingDir, relativePath, filename);
  const exists = fs.existsSync(fullpath);

  if (exists) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    config = require(fullpath);
    // TODO validate config
    return config;
  } else {
    return findIn(path.join("..", relativePath));
  }
}
