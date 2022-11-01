import React, { Suspense } from "react";
import type { NextPage } from "next";
import { Host } from "@leanjs/next";

import { CustomLoader } from "../components/CustomLoader";

const Vue: NextPage = () => {
  return (
    <>
      <h1>Vue page</h1>
      <Suspense fallback={<CustomLoader />}>
        <Host app={{ packageName: "@leanjs/e2e-test-subjects-remote-vue-1" }} />
      </Suspense>
    </>
  );
};

export default Vue;
