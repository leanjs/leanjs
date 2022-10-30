/// <reference types="cypress" />

// TODO before each slow requests to remoteEntry.js 1 sec
describe("Nextjs shell: loading", () => {
  beforeEach(() => {
    // TODO - figure out a way to do this that doesn't introduce a race
    cy.intercept("**/remoteEntry.js", (req) => {
      req.continue((res) => {
        res.delay = 1000;
        res.send();
      });
    }).as("remoteEntry");
  });

  it("displays a custom loading component", () => {
    cy.visit("http://localhost:44440");
    cy.contains("Vue page").click();
    cy.contains("Loading micro frontend").should("be.visible");
  });

  it("doesn't display a loading component the second time the remote app is displayed", () => {
    cy.visit("http://localhost:44440");
    cy.contains("Vue page").click();
    cy.contains("Loading micro frontend").should("be.visible");

    cy.contains("React page").click();
    cy.contains("Vue page").click();
    cy.contains("Loading micro frontend").should("not.exist");
  });
});
