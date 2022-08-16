import { createApp } from "@leanjs/vue-router";

import App from "./components/App.vue";
import packageJson from "../package.json";

export default createApp(App, { packageName: packageJson.name });
