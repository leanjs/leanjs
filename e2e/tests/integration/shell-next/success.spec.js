/// <reference types="cypress" />

describe("Nextjs shell: success", () => {
  it("displays a remote React app", () => {
    cy.visit("http://localhost:44440");
    cy.contains("h1", "Nextjs Host").should("be.visible");
    cy.contains("h1", "NextShell ( RemoteReact1 ) @ 1.0.0").should(
      "be.visible"
    );
  });
});
