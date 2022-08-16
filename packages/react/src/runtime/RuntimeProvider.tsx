import type { Runtime as BaseRuntime } from "@leanjs/core";
import React, { createContext, useContext, ReactElement } from "react";

const RuntimeContext = createContext<
  { runtime: BaseRuntime | undefined } | undefined
>(undefined);

export const RuntimeProvider = ({
  children,
  runtime,
}: {
  children: ReactElement | ReactElement[];
  runtime?: BaseRuntime;
}) => (
  <RuntimeContext.Provider value={{ runtime }}>
    {children}
  </RuntimeContext.Provider>
);

export function useRuntime() {
  const runtime = useContext(RuntimeContext)?.runtime;
  if (!runtime) {
    throw new Error(
      `No LeanJS runtime instance found in the context. Did you pass createRuntime to createApp?`
    );
  }

  return runtime;
}
