import React from "react";
import { Provider } from "react-redux";

import { Layout } from "./components/layout";
import { List } from "./components/list";

import { store } from "./redux/store";

export function DashboardApp() {
  return (
    <Provider store={store}>
      <Layout />
      <List />
    </Provider>
  );
}
