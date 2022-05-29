import { createRemote } from "@leanjs/vue-router";
import { createRuntime } from "@my-org/runtime-shared";

import App from "./components/App.vue";

export default createRemote(App, { createRuntime });
