/// <reference types="cypress" />

describe("Remote React app: success", () => {
  it("displays a dev remote React app", () => {
    cy.visit("http://localhost:44443");

    cy.contains("React micro-app 1");
  });

  it("displays a prod remote React app", () => {
    // Build
    // Start HTTP static files server
    // Assert
  });
});
