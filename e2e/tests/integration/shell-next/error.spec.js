/// <reference types="cypress" />

describe("Nextjs shell: error", () => {
  it("displays an error message when the remote app fails", () => {
    // TODO make request to remoteEntry.js fail by mocking it and returning empty JS
    cy.visit("http://localhost:44443");
  });

  it("displays an error message when the packageName of a remote app doesn't exist", () => {
    cy.visit("http://localhost:44443");
  });

  it("displays a custom error message when using an error component", () => {
    cy.visit("http://localhost:44443");
  });
});
