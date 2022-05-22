import type { NextPage } from "next";
import { Host } from "@leanjs/next";
import { useRouter } from "next/router";

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

const React: NextPage = () => {
  const {
    query: { id },
  } = useRouter();
  const pathname = Array.isArray(id) ? id[0] : id;

  return (
    <>
      <h1>Hosting multiple pages</h1>
      <Host
        pathname={pathname}
        remote={{
          packageName: "@leanjs/e2e-test-subjects-remote-react-sub-pages",
        }}
      />
    </>
  );
};

export default React;
