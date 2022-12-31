/// <reference types="cypress" />

// TODO assert they all are a soft navigation (no full page reload)

describe("Nextjs shell: navigation", () => {
  it("navigates to the root path of a remote React app", () => {
    cy.visit("http://localhost:44440/react-router-sub-pages");
    cy.contains("h1", "Hosting multiple pages").should("be.visible");
    cy.contains("h2", "Pets").should("be.visible");
  });

  it("navigates to a sub-path of a remote React app on the initial page load", () => {
    cy.visit("http://localhost:44440/react-router-sub-pages/1");
    cy.contains("h2", "Buster is a snake").should("be.visible");
    cy.contains("a", "Back to list").click();
    cy.contains("a", "Lola").click();
    cy.contains("h2", "Lola is a cat").should("be.visible");
  });

  it("navigates to a sub-path of a remote React app after the initial page load", () => {
    cy.visit("http://localhost:44440");
    cy.contains("a", "Page Lola").click();
    cy.contains("h2", "Lola is a cat").should("be.visible");
  });

  it("navigates from a remote React app to another page in the shell", () => {
    cy.visit("http://localhost:44440/");
    cy.contains("a", "Vue page").click();

    cy.url().should("include", "/vue");

    cy.contains("h1", "Vue micro-app 1").should("be.visible");
  });

  it("navigates to a remote Vue app with a double click after the initial page load", () => {
    cy.visit("http://localhost:44440");

    cy.contains("a", "Vue page").click();
    cy.url().should("include", "/vue");
    cy.contains("h1", "Vue micro-app 1").should("be.visible");

    cy.contains("a", "Vue page").click();
    cy.url().should("include", "/vue");
    cy.contains("h1", "Vue micro-app 1").should("be.visible");
  });

  it("navigates to a remote Vue app on the initial page load of another remote Vue app", () => {
    cy.visit("http://localhost:44440/vue");
    cy.contains("h1", "Vue page").should("be.visible");
    cy.contains("h1", "Vue micro-app 1").should("be.visible");
    cy.contains("a", "Vue sub pages").click();
    cy.contains("h1", "Vue app with sub pages").should("be.visible");
    cy.contains("h1", "Home page").should("be.visible");
  });

  it("navigates to a sub-path of a remote Vue app on the initial page load", () => {
    cy.visit("http://localhost:44440/vue-sub-pages/about");
    cy.contains("h1", "Vue app with sub pages").should("be.visible");
    cy.contains("h1", "About page").should("be.visible");
    cy.contains("a", "Home").click();
    cy.url().should("not.contain", "/about");
    cy.contains("h1", "Vue app with sub pages").should("be.visible");
    cy.contains("h1", "Home page").should("be.visible");
  });
});
