import { Host } from "@leanjs/next";
import React from "react";
import Head from "next/head";

const Profile = () => {
  return (
    <>
      <Head>
        <title>Profile page</title>
      </Head>
      <Host app={{ packageName: "@my-org/micro-profile" }} />
      <Host app={{ packageName: "@my-org/micro-profile-reset" }} />
    </>
  );
};

export default Profile;
