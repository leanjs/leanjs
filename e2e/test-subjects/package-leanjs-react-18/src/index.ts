import { createRuntimeBindings } from "@leanjs/react/18";
import { createRuntime } from "@leanjs/e2e-test-package-runtime-shared";

export { createRuntime };

export const {
  useGetter,
  useSetter,
  useLoading,
  useError,
  useRuntime,
  HostProvider,
} = createRuntimeBindings(createRuntime);

// re-exporting from this package to use the React and React Dom version 18
// by the e2e tests when importing from this package
export {
  createApp as createReactRouterApp,
  Host as ReactRouterHost,
} from "@leanjs/react-router/18";
export {
  Host as ReactHost,
  createApp as createReactApp,
  ErrorBoundary,
} from "@leanjs/react/18";
