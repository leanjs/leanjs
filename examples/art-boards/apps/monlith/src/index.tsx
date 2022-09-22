import React from "react";
// import { render } from "react-dom";
// @ts-ignore
import { createRoot } from "react-dom/client";

import { App } from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
