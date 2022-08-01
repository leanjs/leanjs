import { createRemote } from "@leanjs/vue-router";
import { createRuntime } from "@my-org/runtime-shared";

import ProfileResetApp from "./components/ProfileResetApp.vue";

export default createRemote(ProfileResetApp, { createRuntime });
