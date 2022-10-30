import React, { Suspense } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Host } from "@leanjs/next";

import { CustomLoader } from "../components/CustomLoader";

/*
👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇
For this page to work we need to add the following in next.config.js:
async rewrites() {
  return [
    {
      source: '/react-sub-pages/:id',
      destination: '/react-sub-pages?id=:id',
    },
  ];
},
*/

const Page: NextPage = () => {
  return (
    <>
      <h1>Hosting multiple pages</h1>
      <Suspense fallback={<CustomLoader />}>
        <Host
          app={() => import("@leanjs/e2e-test-subjects-remote-react-sub-pages")}
        />
      </Suspense>
    </>
  );
};

export default Page;
