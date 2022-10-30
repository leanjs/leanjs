import React from "react";

import type { InnerHostProps } from "./types";
import { Mount, createHost } from "./utils";

export const Host = createHost(function ReactHost(props: InnerHostProps) {
  return <Mount {...props} />;
});
