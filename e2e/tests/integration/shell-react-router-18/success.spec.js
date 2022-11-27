/// <reference types="cypress" />

describe("React Router 18 shell: success", () => {
  it("displays a remote React app", () => {
    cy.visit("http://localhost:44455");
    cy.contains("h1", "React Router 18 shell / React 18.2.0").should(
      "be.visible"
    );
    cy.contains(
      "ReactShell ( RemoteReactRouter18 ) @ ( 1.6.16 ) / React 18.2.0"
    ).should("be.visible");
  });
});
