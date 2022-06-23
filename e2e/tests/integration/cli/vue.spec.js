/// <reference types="cypress" />

describe("Cli Vue config", () => {
  it("displays a Vue app using the dev cli command", () => {
    cy.visit("http://localhost:44444");

    cy.contains("Vue micro-app via @leanjs/cli");
  });
});
