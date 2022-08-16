---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/src/index.ts
---
import { createApp } from "@leanjs/react";
import { createRuntime } from "@<%=h.inflection.dasherize(projectName)%>/runtime-shared";

import { App } from "./App";
import packageJson from "../package.json";

export default createApp(App, { 
    packageName: packageJson.name, 
    createRuntime
});
