import React from "react";
import { createRoot } from "react-dom/client";
// import ReactDOM from "react-dom";

import "./index.css";
import { App } from "../App";

console.log("👉 React version in Monolith", React.version);

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );
