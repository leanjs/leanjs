import { createApp } from "@leanjs/react/18";
import React from "react";

import packageJson from "../package.json";
import ChatApp from "./App";

console.log("👉 React version in Chat App", React.version);

export default createApp(ChatApp, {
  packageName: packageJson.name,
});
