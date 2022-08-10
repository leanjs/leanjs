---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/src/remote.ts
---
import { createRemote } from "@leanjs/react";
import { createRuntime } from "@<%=h.inflection.dasherize(projectName)%>/runtime-shared";

import { App } from "./App";

export default createRemote(App, { createRuntime });
