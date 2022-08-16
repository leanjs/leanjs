import { createApp } from "@leanjs/react-router";
import { createRuntime } from "@my-org/runtime-shared";

import packageJson from "../package.json";
import { FeedApp } from "./components/FeedApp";

export default createApp(FeedApp, {
  createRuntime,
  packageName: packageJson.name,
});
