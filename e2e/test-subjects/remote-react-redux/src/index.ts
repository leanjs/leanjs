import { createApp } from "@leanjs/react";

import { App } from "./App";
import packageJson from "../package.json";

export default createApp(App, {
  packageName: packageJson.name,
});
