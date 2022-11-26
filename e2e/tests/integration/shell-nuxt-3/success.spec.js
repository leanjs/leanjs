/// <reference types="cypress" />

describe("NuxtJs shell: success", () => {
  it("displays a remote React app", () => {
    cy.visit("http://localhost:44447");
    cy.contains("h1", "Nuxt Host").should("be.visible");
    cy.contains(
      "h1",
      "NuxtShell ( RemoteReactRouter17 ) @ 5.6.7 ( 1.6.16 )"
    ).should("be.visible");
  });
});
