import type { NextPage } from "next";
import { Host } from "@leanjs/next";

const ReactRedux: NextPage = () => {
  return (
    <>
      <h1>React Redux page</h1>
      <Host
        app={{ packageName: "@leanjs/e2e-test-subjects-remote-react-redux" }}
      />
    </>
  );
};

export default ReactRedux;
