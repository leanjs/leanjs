/// <reference types="cypress" />

describe("React Router 17 shell: loading", () => {
  it("displays a loading component the first time a remote app is displayed but not the second time", () => {
    cy.intercept("**/remoteEntry.js", (req) => {
      req.continue((res) => {
        res.delay = 1000;
        res.send();
      });
    }).as("remoteEntry");
    cy.visit("http://localhost:44446");
    cy.contains("Visit micro-frontend on another page").click();
    cy.contains("Loading...").should("be.visible");
    cy.contains("Link to home shell").click();
    cy.contains("Visit micro-frontend on another page").click();
    cy.contains("Loading micro frontend").should("not.exist");
  });
});
