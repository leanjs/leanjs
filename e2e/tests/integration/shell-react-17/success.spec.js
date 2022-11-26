/// <reference types="cypress" />

describe("React 17 shell: success", () => {
  it("displays a remote React app", () => {
    cy.visit("http://localhost:44449");
    cy.contains("h1", "ReactShell ( RemoteReact17 ) @").should("be.visible");
    cy.contains("h1", "ReactShell ( RemoteReactRouter17 ) @ ( 1.6.16 )").should(
      "be.visible"
    );
  });
});
