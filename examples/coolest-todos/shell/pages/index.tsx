import { Host } from "@leanjs/next";
import React from "react";
import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Host remote={{ packageName: "@my-org/remote-feed" }} />
    </>
  );
};

export default Home;
