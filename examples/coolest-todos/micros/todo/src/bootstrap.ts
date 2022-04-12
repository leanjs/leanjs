import { createApp, App as VueApp } from "vue";
import { createRuntime, Runtime } from "@my-org/runtime-shared";
import App from "./components/App.vue";

export function mount(el: Element, { runtime }: { runtime: Runtime }) {
  let app: VueApp;
  if (el) {
    app = createApp(App);
    app.provide("runtime", runtime);
    app.mount(el);
  }

  return {
    unmmount: () => {
      app?.unmount();
    },
  };
}

if (process.env.NODE_ENV === "development") {
  const el = document.querySelector("#root-todo-dev");
  if (el) {
    mount(el, { runtime: createRuntime() });
  }
}
