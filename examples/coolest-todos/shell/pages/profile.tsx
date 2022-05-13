import { Host } from "@leanjs/next";
import React from "react";
import Head from "next/head";
// import { MountMicroFrontend } from "../components/MountMicroFrontend";

const Profile = () => {
  return (
    <>
      <Head>
        <title>Profile page</title>
      </Head>
      <Host remote={{ packageName: "@my-org/remote-profile" }} />
      {/* <MountMicroFrontend
        url="http://localhost:8886/remoteEntry.js"
        name="profile_reset"
      /> */}
    </>
  );
};

export default Profile;
