---
to: <%= h.inflection.dasherize(projectName) %>/packages/runtime-shared/src/index.ts
---
import { configureRuntime, GetRuntime } from "@leanjs/core";

const defaultState = {
  // add your default shared state here, for example:
  locale: "en",
};

// You can pass a state type to configureRuntime.
// In this case we don't have to pass it because configureRuntime can infer it from our defaultState
// If you wanted to make locale optional in the state and create a default state then
// configureRuntime wouldn't be able to infer your state.
// In that case you would have to pass the following state type to the generic configureRuntime function
// export interface State {
//   locale?: string;
// }

export const { createRuntime } = configureRuntime(defaultState)({
  onError: (error) =>
    console.log(`🚨 log this properly 🔥! e.g. Sentry`, error),
});

type MyRuntime = GetRuntime<typeof createRuntime>

