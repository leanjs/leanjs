import { useRuntime } from "@leanjs/react";
import React from "react";
import { Link } from "react-router-dom";

export function RemoteReact1() {
  const runtime = useRuntime();
  return (
    <>
      <h1>
        {runtime.context.appName} @ {runtime.context.version}
      </h1>
      <Link to="/">Home page</Link>
    </>
  );
}
