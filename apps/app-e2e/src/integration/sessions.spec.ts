describe('sessions', () => {
  beforeEach(() => {
    cy.visit('/admin/dashboard');
    cy.get(':nth-child(1) > .card > .card-header')
      .invoke('text')
      .then((text) => {
        const application = text.split(' - ');

        // Get application name from the card header
        const applicationName = application[0].trim();
        // Get application version from the card header
        const applicationVersion = application[1].trim();

        cy.visit(
          `/admin/applications/${applicationName}/${applicationVersion}/sessions`
        );

        cy.get('.datagrid clr-dg-row a').first().click();
      });
  });

  it('should be able to click o "applications" button to return to dashboard', () => {
    cy.get('.subtitle > a').first().click();
    cy.url().should('include', '/admin/dashboard');
  });

  it('should be able to click on "sessions" button to return to sessions list', () => {
    // Click on the second "sessions" button
    cy.get(':nth-child(2) > .subtitle')
      .invoke('text')
      .then((text) => {
        const sessions = text;
        const sessionId = sessions.split(' ')[1].trim();

        cy.get(':nth-child(2) > .subtitle > a').click();

        // check if url include /sessions/<sessionId>
        cy.url().should('not.include', `${encodeURIComponent(sessionId)}`);
      });
  });
});
