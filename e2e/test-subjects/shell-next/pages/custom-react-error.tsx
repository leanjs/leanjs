import React, { Suspense } from "react";
import type { NextPage } from "next";
import { Host } from "@leanjs/next";

import { CustomError } from "../components/CustomError";
import { CustomLoader } from "../components/CustomLoader";
import { ErrorBoundary } from "../components/ErrorBoundary";

const CustomReactError: NextPage = () => (
  <>
    <h1>React Error page</h1>
    <ErrorBoundary errorComponent={CustomError}>
      <Suspense fallback={<CustomLoader />}>
        <Host app={{ packageName: "i-dont-exist-and-have-a-custom-error" }} />
      </Suspense>
    </ErrorBoundary>
  </>
);

export default CustomReactError;
