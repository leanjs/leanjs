---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/src/index.ts
---
import { createApp } from "@leanjs/react/18";

import { App } from "./App";

export default createApp(App);
