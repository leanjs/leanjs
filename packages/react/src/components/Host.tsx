import React from "react";

import type { InnerHostProps } from "../types";
import { Mount, createHost } from "../core";

export const Host = createHost(function ReactHost(props: InnerHostProps) {
  return <Mount {...props} />;
});
