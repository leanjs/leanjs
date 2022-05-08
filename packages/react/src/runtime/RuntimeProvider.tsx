import type { Runtime as BaseRuntime } from "@leanjs/core";
import React, { createContext, useContext, ReactElement } from "react";

const RuntimeContext = createContext<
  { runtime: BaseRuntime | undefined } | undefined
>(undefined);

export const BaseRuntimeProvider = ({
  children,
  runtime,
}: {
  children: ReactElement;
  runtime?: BaseRuntime;
}) => (
  <RuntimeContext.Provider value={{ runtime }}>
    {children}
  </RuntimeContext.Provider>
);

export function useBaseRuntime() {
  const runtime = useContext(RuntimeContext)?.runtime;
  if (!runtime) {
    throw new Error(
      `No runtime instance found in the context. Did you pass createRuntime to createMicro?`
    );
  }

  return runtime;
}
