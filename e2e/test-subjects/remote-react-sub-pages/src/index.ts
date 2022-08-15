import { createApp } from "@leanjs/react-router";

import { App } from "./components/App";
import packageJson from "../package.json";

export default createApp(App, { packageName: packageJson.name });
