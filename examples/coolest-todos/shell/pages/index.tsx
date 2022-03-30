import React from "react";
import Head from "next/head";

import { MountMicroFrontend } from "../components/MountMicroFrontend";

const Home = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <MountMicroFrontend
        url="http://localhost:8889/remoteEntry.js"
        name="feed"
      />
    </>
  );
};

export default Home;
