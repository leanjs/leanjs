import { createApp } from "@leanjs/vue-router";

import { routes } from "./routes";
import App from "./App.vue";
import packageJson from "../package.json";

export default createApp(App, {
  packageName: packageJson.name,
  router: {
    routes,
  },
});
