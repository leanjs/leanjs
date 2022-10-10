import { createApp } from "@leanjs/vue-router";

import TodoApp from "./components/TodoApp.vue";

export default createApp(TodoApp, { appName: "Todo" });
