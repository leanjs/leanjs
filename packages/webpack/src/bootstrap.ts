import type { CreateRuntime, MountFunc, Runtime } from "@leanjs/core";

const indexError = new Error(
  `🔥🔥🔥 src/index file or it doesn't export default createApp(app, { packageName }) 🔥🔥🔥`
);

interface Host {
  mount?: MountFunc;
  runtime?: Runtime;
}

function host({ mount, runtime }: Host) {
  const el = document.createElement("div");
  document.body.appendChild(el);

  if (!mount || typeof mount !== "function") {
    throw indexError;
  }

  if (el) {
    mount(el, {
      runtime,
      onError: (error: any) => {
        throw error;
      },
    });
  }
}
interface BootstrapOptions {
  createRuntime?: CreateRuntime;
}
export const bootstrap = ({ createRuntime }: BootstrapOptions = {}) => {
  import("./src/index").then(({ default: createComposableApp }) => {
    if (!createComposableApp || typeof createComposableApp !== "function") {
      throw indexError;
    }

    const { mount } = createComposableApp({
      isSelfHosted: true,
    });

    host({
      mount,
      runtime: createRuntime?.(),
    });
  });
};
