import type { Runtime as BaseRuntime } from "@leanjs/core";
import React, { createContext, useContext, ReactElement } from "react";

export const ReactRuntimeContext = createContext<{
  runtime?: BaseRuntime;
  isSelfHosted?: boolean;
}>({});

export const RuntimeProvider = ({
  children,
  runtime,
  isSelfHosted,
}: {
  children: ReactElement | ReactElement[];
  runtime?: BaseRuntime;
  isSelfHosted: boolean;
}) => (
  <ReactRuntimeContext.Provider value={{ runtime, isSelfHosted }}>
    {children}
  </ReactRuntimeContext.Provider>
);

export function useRuntime() {
  const { runtime, isSelfHosted } = useContext(ReactRuntimeContext);

  if (!runtime) {
    throw new Error(
      `No LeanJS runtime instance found in the context. ${
        isSelfHosted
          ? "Did you add a src/selfHosted.ts|js file with an export { createRuntime } ?"
          : "Did you add a HostProvider?"
      }`
    );
  }

  return runtime;
}
