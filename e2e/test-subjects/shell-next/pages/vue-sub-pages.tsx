import type { NextPage } from "next";
import { Host } from "@leanjs/next";
import { useRouter } from "next/router";
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

const React: NextPage = () => {
  const {
    query: { path },
  } = useRouter();
  const pathname = Array.isArray(path) ? path[0] : path;

  return (
    <>
      <h1>Hosting multiple pages</h1>
      <Host
        pathname={pathname}
        loadingComponent={CustomLoader}
        app={{
          packageName: "@leanjs/e2e-test-subjects-remote-vue-sub-pages",
        }}
      />
    </>
  );
};

export default React;
