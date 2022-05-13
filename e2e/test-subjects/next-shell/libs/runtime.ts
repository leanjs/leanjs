import { configureRuntime } from "@leanjs/core";
import { createRuntimeBindings } from "@leanjs/react";

export const { createRuntime } = configureRuntime({})({
  onError: (error) => {
    throw error; // TODO log this properly
  },
});

export const { HostProvider } = createRuntimeBindings(createRuntime);
