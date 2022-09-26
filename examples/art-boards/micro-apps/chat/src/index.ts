import { createApp } from "@leanjs/react";

import packageJson from "../package.json";
import ChatApp from "./App";

export default createApp(ChatApp, {
  packageName: packageJson.name,
});
