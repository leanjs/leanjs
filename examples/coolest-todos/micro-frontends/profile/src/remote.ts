import { createRemote } from "@leanjs/react-router";
import { createRuntime } from "@my-org/runtime-shared";

import { ProfileApp } from "./components/ProfileApp";

export default createRemote(ProfileApp, { createRuntime });
