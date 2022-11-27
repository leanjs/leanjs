/// <reference types="cypress" />

describe("Remote React 18 app: success", () => {
  it("displays a dev remote React app", () => {
    cy.visit("http://localhost:44451");

    cy.contains("SelfHosted ( RemoteReact18 ) @ ( 1.6.16 ) / React 18.2.0");
  });

  it("displays a prod remote React app", () => {
    // Build
    // Start HTTP static files server
    // Assert
  });
});
