import { configureRuntime, GetRuntime } from "@leanjs/core";

const defaultState = {
  locale: "en",
};

export const { createRuntime } = configureRuntime(defaultState)({
  onError: (error) =>
    console.log(`🚨 log this properly 🔥! e.g. Sentry`, error),
});

export type Runtime = GetRuntime<typeof createRuntime>;
