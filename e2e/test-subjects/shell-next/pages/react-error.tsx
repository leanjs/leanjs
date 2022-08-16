import type { NextPage } from "next";
import { Host } from "@leanjs/next";

const ReactError: NextPage = () => {
  return (
    <>
      <h1>React Error page</h1>
      <Host app={{ packageName: "i-dont-exist-but-have-a-default-error" }} />
    </>
  );
};

export default ReactError;
