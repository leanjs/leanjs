import { configureRuntime, GetRuntime } from "@leanjs/core";
import Pusher from "pusher-js";

export const defaultState = {
  locale: "en",
};

export const { createRuntime } = configureRuntime(defaultState)({
  onError: (error) => {
    console.log(`🚨 log this properly 🔥! e.g. Sentry`, error);
  },
  context: {
    pusher: () => new Pusher("key"),
  },
});

export type CreateRuntime = typeof createRuntime;
export type Runtime = GetRuntime<CreateRuntime>;
