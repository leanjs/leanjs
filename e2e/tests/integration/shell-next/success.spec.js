/// <reference types="cypress" />

describe("Nextjs shell: success", () => {
  it("displays a remote React app", () => {
    cy.visit("http://localhost:44443");
  });
});
