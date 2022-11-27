/// <reference types="cypress" />

describe("Remote React Router 17 app: success", () => {
  it("displays a dev remote React app", () => {
    cy.visit("http://localhost:44452");

    cy.contains(
      "SelfHosted ( RemoteReactRouter17 ) @ ( 1.6.16 ) / React 17.0.2"
    );
  });

  it("displays a prod remote React app", () => {
    // Build
    // Start HTTP static files server
    // Assert
  });
});
