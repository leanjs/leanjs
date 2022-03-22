import type { Runtime as BaseRuntime } from "@leanjs/runtime";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";

interface RuntimeProviderProps {
  children: ReactNode;
  runtime: BaseRuntime;
}

const RuntimeContext = createContext<BaseRuntime | undefined>(undefined);

export const RuntimeProvider = ({
  children,
  runtime,
}: RuntimeProviderProps) => (
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
