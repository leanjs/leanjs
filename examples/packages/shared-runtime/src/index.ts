import { configureRuntime } from "@leanjs/runtime";

const defaultState = {
  theme: "dark",
  username: "Alex",
};

export const { createRuntime } = configureRuntime(defaultState)({
  onError: console.log, // add a proper logger here
});
