import React from "react";
import { Provider } from "react-redux";
import { Settings } from "./components/Settings";
import type { Store } from "./store";

export function App({ store }: { store: Store }) {
  return (
    <Provider store={store}>
      <h2>Hello 👋 remote-redux</h2>
      <Settings />
    </Provider>
  );
}
