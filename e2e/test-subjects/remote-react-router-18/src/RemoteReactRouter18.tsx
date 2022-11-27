import { useRuntime } from "@leanjs/e2e-test-package-leanjs-react-18";
import React from "react";
// import { Link } from "react-router-dom";

export function RemoteReactRouter18() {
  const runtime = useRuntime();
  return (
    <>
      <h1>
        {runtime.context.appName} @ {runtime.context.version} / React{" "}
        {React.version}
      </h1>
      {/* <Link to="/">Home page</Link> */}
    </>
  );
}
