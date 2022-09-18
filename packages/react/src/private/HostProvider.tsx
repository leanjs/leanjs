import React, { createContext } from "react";

import type { HostContextValues, HostProviderProps } from "../types";
import { RuntimeProvider } from "../runtime";

export const HostContext = createContext<HostContextValues | undefined>(
  undefined
);

// export type HostContextType = typeof HostCon

export const HostProvider = ({
  children,
  runtime,
  errorComponent,
  fallback,
  origin,
}: HostProviderProps) => (
  <HostContext.Provider value={{ errorComponent, fallback, origin }}>
    <RuntimeProvider runtime={runtime}>{children}</RuntimeProvider>
  </HostContext.Provider>
);
