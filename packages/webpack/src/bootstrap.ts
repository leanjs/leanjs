import packageJson from "../package.json";
const packageName = packageJson.name;

import("./remote").then(({ default: config }) => {
  const el = document.getElementById(packageName);
  const env = process.env.NODE_ENV;
  const isDev = env === "development";
  const isSelfHosted = true;
  const { mount, createRuntime } = config({
    isDev,
    isSelfHosted,
  });

  if (el) {
    mount(el, { runtime: createRuntime?.() });
  }
});
