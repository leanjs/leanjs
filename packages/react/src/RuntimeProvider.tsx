import type { Runtime as BaseRuntime } from "@leanjs/core";
import React, { createContext, useContext } from "react";

import type { RuntimeProviderComp } from "./types";

const RuntimeContext = createContext<BaseRuntime | undefined>(undefined);

export const RuntimeProvider: RuntimeProviderComp = ({ children, runtime }) => (
  <RuntimeContext.Provider value={runtime}>{children}</RuntimeContext.Provider>
);

export function useGenericRuntime<Runtime extends BaseRuntime>() {
  const context = useContext(RuntimeContext);
  if (!context) {
    throw new Error(
      `No runtime instance found in the context. Did you add a RuntimeProvider?`
    );
  }

  return context as Runtime;
}
