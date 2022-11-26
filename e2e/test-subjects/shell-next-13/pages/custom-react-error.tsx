import React, { Suspense } from "react";
import type { NextPage } from "next";
import { NextHost } from "@leanjs/e2e-test-package-leanjs-react-18/next";
import { ErrorBoundary } from "react-error-boundary";

import { CustomError } from "../components/CustomError";
import { CustomLoader } from "../components/CustomLoader";

const CustomReactError: NextPage = () => (
  <>
    <h1>React Error page</h1>
    <ErrorBoundary fallback={CustomError}>
      <Suspense fallback={<CustomLoader />}>
        <NextHost
          app={{ packageName: "i-dont-exist-and-have-a-custom-error" }}
        />
      </Suspense>
    </ErrorBoundary>
  </>
);

export default CustomReactError;
