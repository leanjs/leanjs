import React from "react";
import type { NextPage } from "next";
import { NextHost } from "@leanjs/e2e-test-package-leanjs-react-18";
import ReactApp from "@leanjs/e2e-test-subjects-remote-react-1";

const Home: NextPage = () => (
  <>
    <h1>Nextjs Host</h1>
    <NextHost app={ReactApp} />
  </>
);

export default Home;
