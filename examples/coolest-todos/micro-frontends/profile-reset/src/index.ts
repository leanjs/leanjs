import { createApp } from "@leanjs/vue-router";
import { createRuntime } from "@my-org/runtime-shared";

import ProfileResetApp from "./components/ProfileResetApp.vue";
import packageJson from "../package.json";

export default createApp(ProfileResetApp, {
  createRuntime,
  packageName: packageJson.name,
});
