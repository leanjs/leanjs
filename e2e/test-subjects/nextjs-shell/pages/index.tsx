import type { NextPage } from "next";
import { Host } from "@leanjs/nextjs";

import { createRuntime, HostProvider } from "../libs/runtime";

const runtime = createRuntime();

const Home: NextPage = () => {
  return (
    <>
      <h1>Nextjs Host</h1>
      <HostProvider runtime={runtime}>
        <Host
          remote={{ packageName: "@leanjs/e2e-test-subjects-micro-react-1" }}
        />
        <hr />
        <Host
          remote={{ packageName: "@leanjs/e2e-test-subjects-micro-react-2" }}
        />
      </HostProvider>
    </>
  );
};

export default Home;
