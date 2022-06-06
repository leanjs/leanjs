---
to: <%= h.inflection.dasherize(projectName) %>/packages/runtime-react/index.ts
---
import { createRuntimeBindings } from "@leanjs/react";
import { createRuntime } from "@<%=h.inflection.dasherize(projectName)%>/runtime-shared";

export { createRuntime };

export const {
  useGetter,
  useSetter,
  useLoading,
  useError,
  useRuntime,
  HostProvider,
} = createRuntimeBindings(createRuntime);
