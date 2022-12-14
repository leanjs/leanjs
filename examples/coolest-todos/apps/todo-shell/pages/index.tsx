import React, { Suspense } from "react";
import Head from "next/head";

import { Host } from "@leanjs/next";
import { ErrorBoundary } from "@leanjs/react/18";

const Home = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <ErrorBoundary>
        <Suspense fallback={<>Loading...</>}>
          <Host app={{ packageName: "@my-org/micro-feed" }} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default Home;
