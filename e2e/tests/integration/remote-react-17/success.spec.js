/// <reference types="cypress" />

describe("Remote React 17 app: success", () => {
  it("displays a dev remote React app", () => {
    cy.visit("http://localhost:44443");

    cy.contains("SelfHosted ( RemoteReact17 ) @ ( 1.6.16 )");
  });

  it("displays a prod remote React app", () => {
    // Build
    // Start HTTP static files server
    // Assert
  });
});
