import { createRemote } from "@leanjs/react-router";
import { createRuntime } from "@my-org/runtime-shared";

import { App } from "./components/App";

export default createRemote(App, { createRuntime });
