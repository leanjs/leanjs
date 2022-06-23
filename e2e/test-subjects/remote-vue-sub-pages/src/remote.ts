import { createRemote } from "@leanjs/vue-router";
import { routes } from "./routes";

import App from "./App.vue";

export default createRemote(App, {
  router: {
    routes,
  },
});
