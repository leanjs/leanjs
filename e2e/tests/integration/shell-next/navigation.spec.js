/// <reference types="cypress" />

// TODO assert they all are a soft navigation (no full page reload)

describe("Nextjs shell: navigation", () => {
  it("navigates to the root path of a remote React app", () => {
    cy.visit("http://localhost:44443/react-sub-pages");
    cy.contains("h1", "Hosting multiple pages").should("be.visible");
    cy.contains("h2", "Pets").should("be.visible");
  });

  it.only("navigates to a sub-path of a remote React app", () => {
    cy.visit("http://localhost:44443/react-sub-pages/1");
    cy.contains("h2", "Buster is a snake").should("be.visible");
    cy.contains("a", "Back to list").click();
    cy.contains("a", "Lola").click();
    cy.contains("h2", "Lola is a cat").should("be.visible");
  });

  it("navigates from a remote React app to another page in the shell", () => {
    cy.visit("http://localhost:44443/");
    cy.contains("a", "Vue page").click();

    cy.url().should("include", "/vue");

    cy.contains("h1", "Vue micro-app 1").should("be.visible");
  });
});
