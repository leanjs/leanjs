import React from "react";
import type { NextPage } from "next";
import { NextHost } from "@leanjs/e2e-test-package-leanjs-react-18/next";
import ReactApp from "@leanjs/e2e-test-subjects-remote-react-router-17";

const Home: NextPage = () => (
  <>
    <h1>Nextjs Host</h1>
    <NextHost app={ReactApp} />
  </>
);

export default Home;
