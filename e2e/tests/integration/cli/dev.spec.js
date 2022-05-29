/// <reference types="cypress" />

describe("Remote React app: success", () => {
  it("displays a dev remote React app", () => {
    cy.visit("http://localhost:56501");

    cy.contains("React micro-app via @leanjs/cli");
  });
});
