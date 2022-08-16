import { createApp } from "@leanjs/vue-router";

import packageJson from "../package.json";
import App from "./components/App.vue";

export default createApp(App, { packageName: packageJson.name });
