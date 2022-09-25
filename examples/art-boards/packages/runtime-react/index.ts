import { createRuntimeBindings } from "@leanjs/react";
import { configureRuntime } from "@leanjs/core";
import { Application } from "@art-boards/ui-canvas";

const defaultState = {
  // add your default shared state here, for example:
  locale: "en",
};

export const { createRuntime } = configureRuntime(defaultState)({
  onError: (error) =>
    console.log(`🚨 log this properly 🔥! e.g. Sentry`, error),
  apiFactory: {
    canvas: ({ onCleanup }) => {
      const app = new Application({
        antialias: true,
        backgroundColor: 0x202124,
        width: 1024,
        height: Math.max(
          document.documentElement.clientHeight || 0,
          window.innerHeight || 0
        ),
      });
      onCleanup(() => {
        app.destroy();
      });

      return app;
    },
  },
});

export const {
  useGetter,
  useSetter,
  useLoading,
  useError,
  useRuntime,
  HostProvider,
} = createRuntimeBindings(createRuntime);
