import { createApp } from "@leanjs/react-router";
import { createRuntime } from "@my-org/runtime-shared";

import { ProfileApp } from "./components/ProfileApp";
import packageJson from "../package.json";

export default createApp(ProfileApp, {
  createRuntime,
  packageName: packageJson.name,
});
