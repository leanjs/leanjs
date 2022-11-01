import React, { Suspense } from "react";
import type { NextPage } from "next";
import { Host } from "@leanjs/next";

import App from "@leanjs/e2e-test-subjects-remote-react-redux";

const ReactRedux: NextPage = () => (
  <>
    <h1>React Redux page</h1>
    <Host app={App} />
  </>
);

export default ReactRedux;
