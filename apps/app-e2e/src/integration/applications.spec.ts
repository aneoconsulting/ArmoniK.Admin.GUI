describe('applications', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.get(':nth-child(1) > .card > .card-footer > .btn').click();
  });

  it('should be able to click on "applications" button to return to dashboard', () => {
    cy.get('.subtitle > a').click();
    cy.url().should('include', '/dashboard');
  });

  it('should be able to click on a session ID button', () => {
    cy.get('.datagrid clr-dg-row a')
      .first()
      .invoke('text')
      .then((text) => {
        const sessionId = text.trim();

        cy.get('.datagrid clr-dg-row a').first().click();

        // check if url include /sessions/<sessionId>
        cy.url().should(
          'include',
          `/sessions/${encodeURIComponent(sessionId)}`
        );
      });
  });
});
