/// <reference types="cypress" />

describe("Nextjs shell: mount hooks", () => {
  describe("onBeforeMount", () => {
    it("updates Redux state when the shell updates shared state", () => {
      // TODO
    });

    it("updates shared state in the shell when Redux updates shared state", () => {
      // TODO
    });
  });

  describe("onBeforeUnmount", () => {
    it("saves initial state on unmount and uses it in the next mount", () => {
      // TODO
    });
  });
});
