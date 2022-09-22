import type { NextPage } from "next";
import { Host } from "@leanjs/next";
import { Suspense } from "react";

const Home: NextPage = () => {
  return (
    <>
      <h1>Nextjs Host</h1>
      <Suspense fallback={<>...</>}>
        <Host
          app={{ packageName: "@leanjs/e2e-test-subjects-remote-react-1" }}
        />
      </Suspense>
    </>
  );
};

export default Home;
