---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/src/index.ts
---
import { createApp } from "@leanjs/react";

import { App } from "./App";

export default createApp(App, { 
    packageName: "@<%=h.inflection.dasherize(projectName)%>/<%= h.inflection.dasherize(microFrontendName) %>" 
});
