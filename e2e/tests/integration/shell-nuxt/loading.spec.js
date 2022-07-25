/// <reference types="cypress" />

describe("Nuxtjs shell: loading", () => {
  beforeEach(() => {
    // TODO - figure out a way to do this that doesn't introduce a race
    cy.intercept("**/remoteEntry.js", (req) => {
      req.continue((res) => {
        res.delay = 1000;
        res.send();
      });
    }).as("remoteEntry");
  });

  it("displays a default loading component", () => {
    cy.contains("Loading...").should("not.exist");
    cy.visit("http://localhost:44447");
    cy.contains("Vue page").click();
    cy.contains("Loading...").should("be.visible");
  });

  it("displays a custom loading component", () => {
    cy.visit("http://localhost:44447");
    cy.contains("Custom page").click();
    cy.contains("Loading...").should("not.exist");
    cy.contains("Loading Micro-frontend").should("be.visible");
  });

  it("doesn't display a loading component the second time the remote app is displayed", () => {
    cy.visit("http://localhost:44447");
    cy.contains("Vue page").click();
    cy.contains("Loading...").should("be.visible");

    cy.contains("React page").click();
    cy.contains("Vue page").click();
    cy.contains("Loading...").should("not.exist");
  });
});
