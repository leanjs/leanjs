/// <reference types="cypress" />

describe("Nextjs shell: loading", () => {
  it("displays a loading component the first time a remote app is displayed but not the second time", () => {
    cy.intercept("**/remoteEntry.js", (req) => {
      req.continue((res) => {
        res.delay = 1000;
        res.send();
      });
    }).as("remoteEntry");
    cy.visit("http://localhost:44440");
    cy.contains("Vue page").click();
    cy.contains("Loading micro frontend").should("be.visible");
    cy.contains("React page").click();
    cy.contains("Vue page").click();
    cy.contains("Loading micro frontend").should("not.exist");
  });
});
