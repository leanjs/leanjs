import React from "react";

import type { CreateHostProps } from "./types";
import { Mount, createHost } from "./utils";

function ReactHost(props: CreateHostProps) {
  return <Mount {...props} />;
}

export const Host = createHost(ReactHost);
