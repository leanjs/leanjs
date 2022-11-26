import { useRuntime } from "@leanjs/e2e-test-package-leanjs-react-18";
import React from "react";

export function RemoteReact18() {
  const runtime = useRuntime();
  return (
    <>
      <h1>
        {runtime.context.appName} @ {runtime.context.version}
      </h1>
    </>
  );
}
