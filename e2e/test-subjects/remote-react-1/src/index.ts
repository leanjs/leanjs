import { createApp } from "@leanjs/react-router";

import packageJson from "../package.json";
import { App } from "./components/App";

export default createApp(App, { packageName: packageJson.name });
