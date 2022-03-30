import { createApp } from "vue";
import { fetchUsername } from "@my-org/user";
import { createRuntime } from "@my-org/shared-runtime";
import App from "./components/App.vue";

export function mount(el, { runtime }) {
  if (el) {
    runtime?.load("username", fetchUsername);
    const app = createApp(App, { runtime });
    app.mount(el);
  }

  return {
    unmmount: () => {
      app.unmmount();
    },
  };
}

if (process.env.NODE_ENV === "development") {
  const el = document.querySelector("#root-todo-dev");
  if (el) {
    mount(el, { runtime: createRuntime() });
  }
}
