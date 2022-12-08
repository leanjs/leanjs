import React from "react";
import { HostProvider, createRuntime } from "@my-org/runtime-react";
import { Nav } from "../components/Nav";

const runtime = createRuntime({ context: { appName: "TodoShell" } });

export default function MyApp({ Component, pageProps }) {
  return (
    <HostProvider origin="http://localhost:56600" runtime={runtime}>
      <Nav />
      <Component {...pageProps} />
    </HostProvider>
  );
}
