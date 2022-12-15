import React, { Suspense } from "react";
import Head from "next/head";

import { Host } from "@leanjs/next";
import { ErrorBoundary } from "@leanjs/react/18";

const Todo = () => {
  return (
    <>
      <Head>
        <title>Host & Chat</title>
      </Head>
      <ErrorBoundary>
        <Suspense fallback={<>Loading...</>}>
          <Host app={{ packageName: "@my-org/micro-todo" }} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default Todo;
