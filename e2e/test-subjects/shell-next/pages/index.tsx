import type { NextPage } from "next";
import { Host } from "@leanjs/next";

const Home: NextPage = () => {
  return (
    <>
      <h1>Nextjs Host</h1>
      <Host app={{ packageName: "@leanjs/e2e-test-subjects-remote-react-1" }} />
    </>
  );
};

export default Home;
