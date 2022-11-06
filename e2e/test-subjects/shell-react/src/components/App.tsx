import React, { Suspense } from "react";
import { Host, ErrorBoundary } from "@leanjs/react";
import {
  createRuntime,
  HostProvider,
} from "@leanjs/e2e-test-package-runtime-react";

import reactThrowErrorApp from "@leanjs/e2e-test-subjects-remote-react-throw-error";

const runtime = createRuntime({ context: { appName: "ReactShell" } });

export function App() {
  return (
    <HostProvider origin="http://localhost:56500" runtime={runtime}>
      <h1>React shell</h1>

      <ErrorBoundary fallback={() => <h1>Shell Error Boundary</h1>}>
        <Suspense fallback={<>Loading...</>}>
          <Host app={reactThrowErrorApp} />
          <Host app={reactThrowErrorApp} />
        </Suspense>
      </ErrorBoundary>
    </HostProvider>
  );
}
