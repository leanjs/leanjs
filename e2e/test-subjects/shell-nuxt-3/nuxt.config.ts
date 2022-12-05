// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  builder: "webpack",
  build: {
    transpile: [
      "@leanjs/e2e-test-package-runtime-shared",
      "@leanjs/e2e-test-package-runtime-vue",
      "@leanjs/e2e-test-subjects-remote-vue-3",
    ],
  },
});
