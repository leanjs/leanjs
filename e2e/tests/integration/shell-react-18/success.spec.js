/// <reference types="cypress" />

describe("React 18 shell: success", () => {
  it("displays a remote React app", () => {
    cy.visit("http://localhost:44454");
    cy.contains("h1", "React shell / React 18.2.0").should("be.visible");
    cy.contains(
      "h1",
      "ReactShell ( RemoteReact18 ) @ ( 1.6.16 ) / React 18.2.0"
    ).should("be.visible");
    cy.contains(
      "h1",
      "ReactShell ( RemoteReactRouter18 ) @ ( 1.6.16 ) / React 18.2.0"
    ).should("be.visible");
  });
});
