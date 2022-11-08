/// <reference types="cypress" />

// TODO assert they all are a soft navigation (no full page reload)

describe("Nuxtjs shell: navigation", () => {
  it("navigates to the root path of a remote React app", () => {
    cy.visit("http://localhost:44447");
    cy.contains("h1", "NuxtShell ( RemoteReact1 ) @ 5.6.7 ( 1.6.16 )").should(
      "be.visible"
    );
  });

  it("navigates from a remote React app to another page in the shell and back", () => {
    cy.visit("http://localhost:44447");
    cy.contains("a", "Vue page").click();

    cy.url().should("include", "/vue");

    cy.contains("h1", "Vue micro-app 1").should("be.visible");

    cy.contains("a", "Home page").click();

    cy.url().should("include", "/");
    cy.contains("h1", "NuxtShell ( RemoteReact1 ) @ 5.6.7 ( 1.6.16 )").should(
      "be.visible"
    );
  });
});
