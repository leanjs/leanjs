import type { NextPage } from "next";
import { Host } from "@leanjs/next";
import { _ } from "@leanjs/react";
// import reactThrowErrorApp from "@leanjs/e2e-test-subjects-remote-react-throw-error";

// const { ErrorBoundary } = _;

const ReactError: NextPage = () => {
  return (
    <>
      <h1>React Error page</h1>
      <Host app={{ packageName: "i-dont-exist-but-have-a-default-error" }} />
      {/* <hr />
      <Host app={reactThrowErrorApp} /> | <Host app={reactThrowErrorApp} />
      <hr />
      <ErrorBoundary
        errorComponent={() => (
          <h1 style={{ paddingBottom: "100px" }}>Next Shell Error Boundary</h1>
        )}
      >
        <Host app={reactThrowErrorApp} errorComponent={null} />
        <Host app={reactThrowErrorApp} errorComponent={null} />
      </ErrorBoundary> */}
    </>
  );
};

export default ReactError;
