import type { Runtime as BaseRuntime } from "@leanjs/core";
import React, { createContext, useContext, ReactElement } from "react";

const RuntimeContext = createContext<BaseRuntime | undefined>(undefined);

export const RuntimeProvider = ({
  children,
  runtime,
}: {
  children: ReactElement | ReactElement[];
  runtime?: BaseRuntime;
}) => (
  <RuntimeContext.Provider value={runtime}>{children}</RuntimeContext.Provider>
);

export function useRuntime<MyRuntime extends BaseRuntime>() {
  const context = useContext(RuntimeContext);
  if (!context) {
    throw new Error(
      `No LeanJS runtime instance found in the context. Are you using a HostProvider?`
    );
  }

  return context as MyRuntime;
}
