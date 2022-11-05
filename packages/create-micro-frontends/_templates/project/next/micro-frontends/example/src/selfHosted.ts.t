---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/src/selfHosted.ts
---
export { createRuntime } from "@<%=h.inflection.dasherize(projectName)%>/runtime-shared";
