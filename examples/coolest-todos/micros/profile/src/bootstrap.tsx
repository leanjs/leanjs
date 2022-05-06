import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { Runtime, RuntimeProvider, createRuntime } from "@my-org/runtime-react";

// 🔥 this code is is not production ready

interface MountOptions {
  runtime: Runtime;
}

export function mount(el: HTMLElement, { runtime }: MountOptions) {
  if (el)
    ReactDOM.render(
      <RuntimeProvider runtime={runtime}>
        <App />
      </RuntimeProvider>,
      el
    );

  return {
    unmount: () => {
      if (el) ReactDOM.unmountComponentAtNode(el);
    },
  };
}

if (process.env.NODE_ENV === "development") {
  const el = document.getElementById("root-profile-dev");
  if (el) {
    mount(el, { runtime: createRuntime() });
  }
}
