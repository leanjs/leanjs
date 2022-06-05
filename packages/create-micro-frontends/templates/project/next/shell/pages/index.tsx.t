---
to: <%= h.inflection.dasherize(projectName) %>/shell/pages/index.tsx
---
import { Host } from "@leanjs/next";
import React from "react";
import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <h1>Hello from Nextjs</h1>
      <Host remote={{ packageName: "@<%=h.inflection.dasherize(projectName)%>/<%= h.inflection.dasherize(microFrontendName) %>" }} />
    </>
  );
};

export default Home;
