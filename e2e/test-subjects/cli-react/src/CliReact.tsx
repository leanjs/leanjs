import React from "react";
import { useRuntime } from "@leanjs/e2e-test-package-runtime-react";

export function CliReact() {
  const runtime = useRuntime();
  console.log("test pusher", runtime.api.pusher.key);

  return <h1>React micro-app via @leanjs/cli</h1>;
}
