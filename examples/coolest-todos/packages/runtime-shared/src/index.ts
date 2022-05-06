import { configureRuntime, GetRuntime } from "@leanjs/runtime";
import Pusher from "pusher-js";

const defaultState = {
  theme: "light",
  username: {
    current: "",
    previous: undefined,
  },
};

export interface State {
  theme: string;
  username: {
    current?: string;
    previous?: string;
  };
}

export type Runtime = GetRuntime<typeof createRuntime>;

export const { createRuntime } = configureRuntime<State>(defaultState)({
  onError: console.log, // add a proper logger here,
  context: {
    pusher: new Pusher("ADD_KEY", {
      cluster: "eu",
    }),
  },
});
