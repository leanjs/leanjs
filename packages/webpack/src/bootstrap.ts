import type {
  BootstrapOptions,
  BootstrapOutput,
  CreateRuntime,
} from "@leanjs/core";

const indexError = new Error(
  `🔥🔥🔥 src/index file or it doesn't export default createApp(app, options) 🔥🔥🔥`
);

export const bootstrap = (createRuntime?: CreateRuntime) => {
  (
    import("./index") as unknown as Promise<{
      default: (options?: BootstrapOptions) => BootstrapOutput;
    }>
  ).then((index) => {
    const config = index?.default;
    if (!config || typeof config !== "function") {
      throw indexError;
    }

    const el = document.createElement("div");
    document.body.appendChild(el);
    const isSelfHosted = true;
    const { mount } = config({
      isSelfHosted,
    });

    if (!mount || typeof mount !== "function") {
      throw indexError;
    }

    if (el) {
      mount(el, { runtime: createRuntime?.() });
    }
  });
};
