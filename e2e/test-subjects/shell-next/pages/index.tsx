import React from "react";
import type { NextPage } from "next";
import { Host } from "@leanjs/next";
import ReactApp from "@leanjs/e2e-test-subjects-remote-react-1";

const Home: NextPage = () => (
  <>
    <h1>Nextjs Host</h1>
    <Host app={ReactApp} />
  </>
);

export default Home;
