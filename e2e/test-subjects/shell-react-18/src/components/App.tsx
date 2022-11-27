import React, { Suspense } from "react";
import {
  createRuntime,
  HostProvider,
  ReactHost,
  ErrorBoundary,
} from "@leanjs/e2e-test-package-leanjs-react-18";
import react18App from "@leanjs/e2e-test-subjects-remote-react-18";
import reactRouter18App from "@leanjs/e2e-test-subjects-remote-react-router-18";

const runtime = createRuntime({ context: { appName: "ReactShell" } });

export function App() {
  return (
    <HostProvider origin="http://localhost:56500" runtime={runtime}>
      <h1>React shell / React {React.version}</h1>

      <ErrorBoundary fallback={() => <h1>Shell Error Boundary</h1>}>
        <Suspense fallback={<>Loading...</>}>
          <ReactHost app={react18App} />
          <ReactHost app={reactRouter18App} />
        </Suspense>
      </ErrorBoundary>
    </HostProvider>
  );
}
