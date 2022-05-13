import React, { createContext } from "react";

import type { HostContextValues, HostProviderProps } from "../types";
import { RuntimeProvider } from "../runtime";

export const HostContext = createContext<HostContextValues | undefined>(
  undefined
);

export const HostProvider = ({
  children,
  runtime,
  errorComponent,
  loadingComponent,
  origin,
}: HostProviderProps) => (
  <HostContext.Provider value={{ errorComponent, loadingComponent, origin }}>
    <RuntimeProvider runtime={runtime}>{children}</RuntimeProvider>
  </HostContext.Provider>
);
