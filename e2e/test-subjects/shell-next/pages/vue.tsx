import React, { Suspense } from "react";
import type { NextPage } from "next";
import { NextHost } from "@leanjs/e2e-test-package-leanjs-react-18";

import { CustomLoader } from "../components/CustomLoader";

const Vue: NextPage = () => {
  return (
    <>
      <h1>Vue page</h1>
      <Suspense fallback={<CustomLoader />}>
        <NextHost
          app={{ packageName: "@leanjs/e2e-test-subjects-remote-vue-1" }}
        />
      </Suspense>
    </>
  );
};

export default Vue;
