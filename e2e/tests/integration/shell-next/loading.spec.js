/// <reference types="cypress" />

// TODO before each slow requests to remoteEntry.js 1 sec
describe("Nextjs shell: loading", () => {
  it("displays a default loading component", () => {
    cy.visit("http://localhost:44443");
  });

  it("displays a custom loading component", () => {
    cy.visit("http://localhost:44443");
  });

  it("doesn't display a loading component the second time the remote app is displayed", () => {
    cy.visit("http://localhost:44443");
  });
});
