import type { BootstrapOptions, CreateRemoteOutput } from "@leanjs/core";
import packageJson from "../package.json";

const packageName = packageJson.name;
const indexError = new Error(
  `🔥🔥🔥 src/index file in ${packageName} doesn't export default createRemote(app, options) 🔥🔥🔥`
);

(
  import("./index") as unknown as Promise<{
    default: (options?: BootstrapOptions) => CreateRemoteOutput;
  }>
).then((index) => {
  const config = index?.default;
  if (!config || typeof config !== "function") {
    throw indexError;
  }
  const el = document.getElementById(packageName);
  const isSelfHosted = true;
  const { mount, createRuntime } = config({
    isSelfHosted,
  });

  if (!mount || typeof mount !== "function") {
    throw indexError;
  }

  if (el) {
    mount(el, { runtime: createRuntime?.() });
  }
});
