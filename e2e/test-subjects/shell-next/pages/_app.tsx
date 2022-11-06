// import type { AppProps } from "next/app";
import React from "react";
import {
  createRuntime,
  HostProvider,
} from "@leanjs/e2e-test-package-runtime-react";
import { Nav } from "../components/Nav";

const runtime = createRuntime({ context: { appName: "NextShell" } });

const App = ({
  Component,
  pageProps,
}: {
  // AppProps types Component as ReactElement and it gets confused with JSX.Element for some reason in this monorepo
  Component: () => JSX.Element;
  pageProps: Record<string, any>;
}) => (
  <HostProvider origin="http://localhost:56500" runtime={runtime}>
    <Nav />
    <Component {...pageProps} />
  </HostProvider>
);

// eslint-disable-next-line import/no-default-export
export default App;
