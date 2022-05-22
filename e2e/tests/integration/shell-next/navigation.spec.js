/// <reference types="cypress" />

// TODO assert they all are a soft navigation (no full page reload)

describe("Nextjs shell: navigation", () => {
  it("navigates to the root path of a remote React app", () => {
    cy.visit("http://localhost:44443/react-sub-pages");
  });

  it("navigates to a sub-path of a remote React app", () => {
    cy.visit("http://localhost:44443/react-sub-pages/1");
  });

  it("navigates from a remote React app to another page in the shell", () => {
    cy.visit("http://localhost:44443/");
  });
});
