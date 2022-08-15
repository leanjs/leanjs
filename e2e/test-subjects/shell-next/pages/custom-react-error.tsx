import type { NextPage } from "next";
import { Host } from "@leanjs/next";
import { CustomError } from "../components/CustomError";

const CustomReactError: NextPage = () => {
  return (
    <>
      <h1>React Error page</h1>
      <Host
        errorComponent={CustomError}
        app={{ packageName: "i-dont-exist-and-have-a-custom-error" }}
      />
    </>
  );
};

export default CustomReactError;
