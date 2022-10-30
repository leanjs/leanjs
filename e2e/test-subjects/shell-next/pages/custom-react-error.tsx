import React, { Suspense } from "react";
import type { NextPage } from "next";
import { Host } from "@leanjs/next";

import { CustomError } from "../components/CustomError";
import { CustomLoader } from "../components/CustomLoader";

const CustomReactError: NextPage = () => (
  <>
    <h1>React Error page</h1>
    <Suspense fallback={<CustomLoader />}>
      <Host
        errorComponent={CustomError}
        app={{ packageName: "i-dont-exist-and-have-a-custom-error" }}
      />
    </Suspense>
  </>
);

export default CustomReactError;
