// import type { AppProps } from "next/app";
import React from "react";
import Link from "next/link";

import { createRuntime, HostProvider } from "../libs/runtime";

const runtime = createRuntime();

const App = ({
  Component,
  pageProps,
}: {
  // AppProps types Component as ReactElement and it gets confused with JSX.Element for some reason in this monorepo
  Component: () => JSX.Element;
  pageProps: Record<string, any>;
}) => (
  <HostProvider origin="http://localhost:56500" runtime={runtime}>
    <ul>
      <li>
        <Link href="/">React page</Link>
      </li>
      <li>
        <Link href="/vue">Vue page</Link>
      </li>
    </ul>
    <Component {...pageProps} />
  </HostProvider>
);

// eslint-disable-next-line import/no-default-export
export default App;
