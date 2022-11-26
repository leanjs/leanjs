import React from "react";
import type { NextPage } from "next";
import { NextHost } from "@leanjs/e2e-test-package-leanjs-react-18/next";
import { ErrorBoundary } from "react-error-boundary";
// import reactThrowErrorApp from "@leanjs/e2e-test-subjects-remote-react-throw-error-17";

import { CustomError } from "../components/CustomError";

const ReactError: NextPage = () => {
  return (
    <>
      <h1>React Error page</h1>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <ErrorBoundary fallback={CustomError}>
        <NextHost
          app={{ packageName: "i-dont-exist-but-have-a-default-error" }}
        />
      </ErrorBoundary>
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
