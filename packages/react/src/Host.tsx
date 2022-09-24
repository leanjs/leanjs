import React from "react";

import type { CreateHostProps } from "./types";
import { Mount, createHost } from "./utils";

function ReactHost(props: CreateHostProps) {
  return <Mount {...props} />;
}

export const Host = createHost(ReactHost);

// export const Host = React.lazy(() => {
//   console.log("aaaaaa dsdfasdfsf");
//   return new Promise((resolve) => {
//     //import("./features/chat").then((file) =>
//     // @ts-ignore
//     resolve({ default: () => <h1>Test</h1> });
//     //);
//   });
// });
