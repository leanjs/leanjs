import { createApp } from "vue";
import App from "./components/App.vue";

export function mount(el, { runtime }) {
  if (el) {
    const app = createApp(App, { runtime });
    app.mount(el);
  }

  return { unmmount: () => {} };
}

if (process.env.NODE_ENV === "development") {
  const el = document.querySelector("#root-chat-dev");
  if (el) {
    mount(el, { runtime: null });
  }
}
