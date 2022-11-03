import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: false,
    specPattern: "integration/**/loading.spec.js",
  },
  video: false,
});
