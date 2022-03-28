import { configureRuntime } from "@leanjs/runtime";
import Pusher from "pusher-js";

const defaultState = {
  theme: "dark",
  username: "",
};

export const { createRuntime } = configureRuntime(defaultState)({
  onError: console.log, // add a proper logger here,
  context: {
    pusher: new Pusher("ADD_KEY", {
      cluster: "eu",
    }),
  },
});
