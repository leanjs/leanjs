/// <reference types="cypress" />

// TODO assert they all are a soft navigation (no full page reload)

describe("Nextjs shell: navigation", () => {
  it.skip("navigates to the root path of a remote React app", () => {
    cy.visit("http://localhost:44447");
    cy.contains("h1", "React micro-app 1").should("be.visible");
  });

  it.skip("navigates from a remote React app to another page in the shell and back", () => {
    cy.visit("http://localhost:44447");
    cy.contains("a", "Vue page").click();

    cy.url().should("include", "/vue");

    cy.contains("h1", "Vue micro-app 1").should("be.visible");

    cy.contains("a", "Go to React page").click();

    cy.url().should("include", "/");
    cy.contains("h1", "React micro-app 1").should("be.visible");
  });
});
