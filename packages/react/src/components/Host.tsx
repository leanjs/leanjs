import React from "react";

import type { InnerHostProps } from "../types";
import { createHost } from "../core";

export const Host = createHost(function ReactHost({
  Mount,
  ...rest
}: InnerHostProps) {
  return <Mount {...rest} />;
});
