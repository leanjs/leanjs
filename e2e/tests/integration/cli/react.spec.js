/// <reference types="cypress" />

describe("Cli React config", () => {
  it("displays a React app using the dev cli command", () => {
    cy.visit("http://localhost:56501");

    cy.contains("React micro-app via @leanjs/cli");
  });
});
