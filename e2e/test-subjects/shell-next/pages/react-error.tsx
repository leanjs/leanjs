import type { NextPage } from "next";
import { Host } from "@leanjs/next";
import { useRouter } from "next/router";
import { CustomError } from "../components/CustomError";

const ReactError: NextPage = () => {
  const {
    query: { customError },
  } = useRouter();

  return (
    <>
      <h1>React Error page</h1>
      <Host
        errorComponent={customError ? CustomError : undefined}
        remote={{ packageName: "@leanjs/e2e-test-subjects-not-existing" }}
      />
    </>
  );
};

export default ReactError;
