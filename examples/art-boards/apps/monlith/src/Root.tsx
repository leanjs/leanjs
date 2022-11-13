import React from "react";
import { createRuntime, HostProvider } from "@art-boards/runtime-react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./store";
import { App } from "./App";

const runtime = createRuntime({ context: { appName: "Monolith" } });
const origin = process.env.EXAMPLE_ART_BOARDS_ORIGIN; // "https://d1s8oi6ouy9ssm.cloudfront.net/"
const basename = process.env.EXAMPLE_ART_BOARDS_BASENAME;
///
export function Root() {
  return (
    <Provider store={store}>
      <HostProvider origin={origin} runtime={runtime}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </HostProvider>
    </Provider>
  );
}
