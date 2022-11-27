/// <reference types="cypress" />

describe("React Router 17 shell: success", () => {
  it("displays a remote React app", () => {
    cy.visit("http://localhost:44446");
    cy.contains("h1", "React Router shell / React 17.0.2").should("be.visible");
    cy.contains(
      "ReactRouterShell ( RemoteReactRouter17 ) @ 1.2.3 ( 1.6.16 )"
    ).should("be.visible");
  });
});
