import { useRuntime } from "@leanjs/e2e-test-package-leanjs-react-17";
import React from "react";

export function RemoteReact17() {
  const runtime = useRuntime();
  return (
    <>
      <h1>
        {runtime.context.appName} @ {runtime.context.version}
      </h1>
    </>
  );
}
