import React, { createContext } from "react";
import type { HostContextValues } from "@leanjs/core";
import type { HostProviderProps } from "../types";
import { RuntimeProvider } from "../core";

export const HostContext = createContext<HostContextValues | undefined>(
  undefined
);

export const HostProvider = ({
  children,
  runtime,
  origin,
}: HostProviderProps) => (
  <HostContext.Provider value={{ origin }}>
    <RuntimeProvider isSelfHosted={false} runtime={runtime}>
      {children}
    </RuntimeProvider>
  </HostContext.Provider>
);
