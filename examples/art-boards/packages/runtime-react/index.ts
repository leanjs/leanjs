import { createRuntimeBindings } from "@leanjs/react";
import { configureRuntime } from "@leanjs/core";

const defaultState = {
  // add your default shared state here, for example:
  locale: "en",
};

export const { createRuntime } = configureRuntime(defaultState)({
  onError: (error) =>
    console.log(`🚨 log this properly 🔥! e.g. Sentry`, error),
});

export const {
  useGetter,
  useSetter,
  useLoading,
  useError,
  useRuntime,
  HostProvider,
} = createRuntimeBindings(createRuntime);
