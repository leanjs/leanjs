import React from "react";
import Head from "next/head";
import { Host } from "@leanjs/next";

const Todo = () => {
  return (
    <>
      <Head>
        <title>Host & Chat</title>
      </Head>
      <Host app={{ packageName: "@my-org/micro-todo" }} />
    </>
  );
};

export default Todo;
