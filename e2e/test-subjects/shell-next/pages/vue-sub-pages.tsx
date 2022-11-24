import React, { Suspense } from "react";
import type { NextPage } from "next";
import { NextHost } from "@leanjs/e2e-test-package-leanjs-react-18";

import { CustomLoader } from "../components/CustomLoader";

/*
👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇
For this page to work we need to add the following in next.config.js:
async rewrites() {
  return [
    {
      source: '/vue-sub-pages/:path',
      destination: '/vue-sub-pages?path=:path',
    },
  ];
},
*/

const Page: NextPage = () => (
  <>
    <h1>Hosting multiple pages</h1>
    <Suspense fallback={<CustomLoader />}>
      <NextHost
        app={{
          packageName: "@leanjs/e2e-test-subjects-remote-vue-sub-pages",
        }}
      />
    </Suspense>
  </>
);

export default Page;
