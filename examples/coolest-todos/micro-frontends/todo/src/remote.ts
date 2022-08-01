import { createRemote } from "@leanjs/vue-router";
import { createRuntime } from "@my-org/runtime-shared";

import TodoApp from "./components/TodoApp.vue";

export default createRemote(TodoApp, { createRuntime });
