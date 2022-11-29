import { createRuntimeBindings } from "@leanjs/vue";
import { createRuntime } from "@art-boards/runtime-shared";

export { createRuntime };

export const { useSharedState, HostProvider } =
  createRuntimeBindings(createRuntime);
