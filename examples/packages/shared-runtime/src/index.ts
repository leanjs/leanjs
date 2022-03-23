import { configureRuntime } from "@leanjs/runtime";
import Pusher from "pusher-js";

const defaultState = {
  theme: "dark",
  username: undefined,
};

interface State {
  theme: string;
  username?: string;
}

export const { createRuntime } = configureRuntime<State>(defaultState)({
  onError: console.log, // add a proper logger here,
  context: {
    pusher: new Pusher("947b6030dd7a69c41e5e", {
      cluster: "eu",
      authEndpoint: "http://example.com/pusher/auth",
    }),
  },
});
