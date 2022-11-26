import React from "react";
import type { NextPage } from "next";
import { NextHost } from "@leanjs/e2e-test-package-leanjs-react-18/next";
import App from "@leanjs/e2e-test-subjects-remote-react-redux-17";

const ReactRedux: NextPage = () => (
  <>
    <h1>React Redux page</h1>
    <NextHost app={App} />
  </>
);

export default ReactRedux;
