import { createApp } from "@leanjs/vue-router";

import TodoApp from "./components/TodoApp.vue";
import packageJson from "../package.json";

export default createApp(TodoApp, {
  packageName: packageJson.name,
});
