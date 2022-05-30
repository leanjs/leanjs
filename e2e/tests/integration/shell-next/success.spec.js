/// <reference types="cypress" />

describe("Nextjs shell: success", () => {
  it("displays a remote React app", () => {
    cy.visit("http://localhost:44443");
    cy.contains("h1", "Nextjs Host").should("be.visible");
    cy.contains("h1", "React micro-app 1").should("be.visible");
  });
});
