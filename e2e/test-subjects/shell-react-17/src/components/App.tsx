import React, { Suspense } from "react";
import {
  createRuntime,
  HostProvider,
  ReactHost,
  ErrorBoundary,
} from "@leanjs/e2e-test-package-leanjs-react-17";
import react17App from "@leanjs/e2e-test-subjects-remote-react-17";
import reactRouter17App from "@leanjs/e2e-test-subjects-remote-react-router-17";

const runtime = createRuntime({ context: { appName: "ReactShell" } });

export function App() {
  return (
    <HostProvider origin="http://localhost:56500" runtime={runtime}>
      <h1>React shell</h1>

      <ErrorBoundary fallback={() => <h1>Shell Error Boundary</h1>}>
        <Suspense fallback={<>Loading...</>}>
          <ReactHost app={react17App} />
          <ReactHost app={reactRouter17App} />
        </Suspense>
      </ErrorBoundary>
    </HostProvider>
  );
}
