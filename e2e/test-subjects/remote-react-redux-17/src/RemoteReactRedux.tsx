import React, { useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import { Settings } from "./components/Settings";
import type { AppProps } from "@leanjs/react";
import { useRuntime } from "@leanjs/e2e-test-package-leanjs-react-17";

import { configureStore } from "./store";

export function RemoteReactRedux({
  initialState,
  updateInitialState,
}: AppProps) {
  const runtime = useRuntime();
  const store = useMemo(
    () =>
      configureStore({
        // initial state potentially saved in a previous unmounted app
        ...initialState,
        settings: {
          // merging potentially stale initial state
          ...initialState?.settings,
          // with potentially more up-to-date shared state
          locale: runtime?.state.get("locale"),
        },
      }),
    []
  );

  // update Redux state when shared state changes
  runtime?.state.listen("locale", (locale) =>
    store.dispatch({ type: "UPDATE_LOCALE", payload: locale })
  );

  // update shared state when Redux state changes
  store.subscribe(() => {
    const locale = store.getState().settings?.locale;
    if (runtime && locale) {
      runtime.state.set("locale", locale);
    }
  });

  useEffect(() => {
    return () => updateInitialState(store.getState());
  }, []);

  return (
    <Provider store={store}>
      <h2>Hello 👋 remote-redux</h2>
      <Settings />
    </Provider>
  );
}
