import { Host } from "@leanjs/next";
import React from "react";
import Head from "next/head";

const Profile = () => {
  return (
    <>
      <Head>
        <title>Profile page</title>
      </Head>
      <Host remote={{ packageName: "@my-org/micro-profile" }} />
      <Host remote={{ packageName: "@my-org/micro-profile-reset" }} />
    </>
  );
};

export default Profile;
