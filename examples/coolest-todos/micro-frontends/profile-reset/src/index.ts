import { createApp } from "@leanjs/vue-router";

import ProfileResetApp from "./components/ProfileResetApp.vue";
import packageJson from "../package.json";

export default createApp(ProfileResetApp, {
  packageName: packageJson.name,
});
