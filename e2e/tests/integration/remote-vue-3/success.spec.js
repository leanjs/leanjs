/// <reference types="cypress" />

describe("Remote Vue app: success", () => {
  it("displays a dev remote Vue app", () => {
    cy.visit("http://localhost:44442");
  });

  it("displays a prod remote Vue app", () => {
    // Build
    // Start HTTP static files server
    // Assert
  });
});
