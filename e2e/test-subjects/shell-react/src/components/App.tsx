import React from "react";
import { Host, _ } from "@leanjs/react";
import {
  createRuntime,
  HostProvider,
} from "@leanjs/e2e-test-package-runtime-react";

import reactThrowErrorApp from "@leanjs/e2e-test-subjects-remote-react-throw-error";

const { ErrorBoundary } = _;

const runtime = createRuntime();

export function App() {
  return (
    <HostProvider origin="http://localhost:56500" runtime={runtime}>
      <h1>React shell</h1>
      <ErrorBoundary errorComponent={() => <h1>Shell Error Boundary</h1>}>
        <Host app={reactThrowErrorApp} errorComponent={null} />
        <Host app={reactThrowErrorApp} errorComponent={null} />
      </ErrorBoundary>
    </HostProvider>
  );
}
