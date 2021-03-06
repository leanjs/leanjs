describe('leanjs.com: contact', () => {
  beforeEach(() => cy.visit('/'));

  it('should subscribe to the newsletter', () => {
    cy.get('input[name="name"]').type('Alex Lobera');
    cy.get('input[name="email"]').type('hello+e2e@leanjs.com');
    cy.get('textarea[name="message"]').type(
      'βββπ€π€π€this is a message from an e2e testπ€π€π€βββ'
    );

    cy.findAllByText(/Submit/).click();

    cy.findAllByText(
      /Thank you for your submission! We will be in touch shortly./,
      { timeout: 15000 }
    );
  });
});
