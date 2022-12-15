import React, { Suspense } from "react";
import Head from "next/head";

import { Host } from "@leanjs/next";
import { ErrorBoundary } from "@leanjs/react/18";

const Profile = () => {
  return (
    <>
      <Head>
        <title>Profile page</title>
      </Head>
      <ErrorBoundary>
        <Suspense fallback={<>Loading...</>}>
          <Host app={{ packageName: "@my-org/micro-profile" }} />
          <Host app={{ packageName: "@my-org/micro-profile-reset" }} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default Profile;
