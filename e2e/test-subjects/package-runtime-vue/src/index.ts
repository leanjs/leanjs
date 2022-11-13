import { createRuntimeBindings } from "@leanjs/vue";
import { createRuntime } from "@leanjs/e2e-test-package-runtime-shared";

export { createRuntime };

export const { HostProvider } = createRuntimeBindings(createRuntime);
