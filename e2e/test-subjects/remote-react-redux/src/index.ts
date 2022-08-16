import { createApp } from "@leanjs/react";
import { createRuntime } from "@leanjs/e2e-test-subjects-package-runtime-shared";

import { configureStore } from "./store";
import { App } from "./App";
import packageJson from "../package.json";

export default createApp(App, {
  createRuntime,
  packageName: packageJson.name,
  onBeforeMount: ({
    runtime,
    initialState,
    updateInitialState,
    onBeforeUnmount,
  }) => {
    const store = configureStore({
      // initial state potentially saved in a previous onBeforeUnmount
      ...initialState,
      settings: {
        // merging potentially stale initial state
        ...initialState?.settings,
        // with potentially more up-to-date shared state
        locale: runtime?.state.locale,
      },
    });

    // update Redux state when shared state changes
    runtime?.subscribe("locale", (locale) =>
      store.dispatch({ type: "UPDATE_LOCALE", payload: locale })
    );

    // update shared state when Redux state changes
    store.subscribe(() => {
      const locale = store.getState().settings?.locale;
      if (runtime && locale) {
        runtime.state.locale = locale;
      }
    });

    onBeforeUnmount(() => {
      // save current Redux state for the next time this remote app is mounted
      updateInitialState(store.getState());
    });

    return { store };
  },
});
