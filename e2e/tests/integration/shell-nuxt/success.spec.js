/// <reference types="cypress" />

describe("NuxtJs shell: success", () => {
  it.skip("displays a remote React app", () => {
    cy.visit("http://localhost:44447");
    cy.contains("h1", "Nuxt Host").should("be.visible");
    cy.contains("h1", "React micro-app 1").should("be.visible");
  });
});
