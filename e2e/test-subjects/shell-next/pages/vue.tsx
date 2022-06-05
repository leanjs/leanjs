import type { NextPage } from "next";
import { Host } from "@leanjs/next";

const Vue: NextPage = () => {
  return (
    <>
      <h1>Vue page</h1>
      <Host
        remote={{ packageName: "@leanjs/e2e-test-subjects-remote-vue-1" }}
      />
    </>
  );
};

export default Vue;
