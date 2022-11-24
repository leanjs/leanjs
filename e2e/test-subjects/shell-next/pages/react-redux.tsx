import React from "react";
import type { NextPage } from "next";
import { NextHost } from "@leanjs/e2e-test-package-leanjs-react-18";
import App from "@leanjs/e2e-test-subjects-remote-react-redux";

const ReactRedux: NextPage = () => (
  <>
    <h1>React Redux page</h1>
    <NextHost app={App} />
  </>
);

export default ReactRedux;
