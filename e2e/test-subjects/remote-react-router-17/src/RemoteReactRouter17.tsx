import { useRuntime } from "@leanjs/e2e-test-package-leanjs-react-17";
import React from "react";
// import { Link } from "react-router-dom";

export function RemoteReactRouter17() {
  const runtime = useRuntime();
  return (
    <>
      <h1>
        {runtime.context.appName} @ {runtime.context.version}
      </h1>
      {/* <Link to="/">Home page</Link> */}
    </>
  );
}
