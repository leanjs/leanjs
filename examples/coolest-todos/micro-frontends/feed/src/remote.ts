import { createRemote } from "@leanjs/react-router";
import { createRuntime } from "@my-org/runtime-shared";

import { FeedApp } from "./components/FeedApp";

export default createRemote(FeedApp, { createRuntime });
