import React from "react";
import { createRuntime, HostProvider } from "@art-boards/runtime-react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./store";
import { App } from "./App";

const runtime = createRuntime();

export function Root() {
  return (
    <Provider store={store}>
      <HostProvider origin="http://localhost:33000" runtime={runtime}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HostProvider>
    </Provider>
  );
}
