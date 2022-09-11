import { configureRuntime } from "@leanjs/core";
import {
  defaultState,
  CreateRuntime,
} from "@leanjs/e2e-test-subjects-package-runtime-shared";
import type Pusher from "pusher-js";

export const createRuntime: CreateRuntime = configureRuntime(defaultState)({
  onError: console.log,
  api: {
    pusher: () => {
      const fakePusher = {
        connect() {
          console.log(`aaaaaaa`);
        },
      } as Pusher;

      return fakePusher;
    },
  },
}).createRuntime;
