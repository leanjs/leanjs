import { createApp } from "@leanjs/vue-router";
import { createRuntime } from "@my-org/runtime-shared";

import TodoApp from "./components/TodoApp.vue";
import packageJson from "../package.json";

export default createApp(TodoApp, {
  createRuntime,
  packageName: packageJson.name,
});
