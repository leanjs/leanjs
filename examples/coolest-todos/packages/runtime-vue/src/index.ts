import { createRuntimeBindings } from "@leanjs/vue";
import { createRuntime } from "@my-org/runtime-shared";

export { createRuntime };

export const { useSharedState, HostProvider } =
  createRuntimeBindings(createRuntime);
