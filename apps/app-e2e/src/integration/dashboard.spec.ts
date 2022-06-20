describe('dashboard', () => {
  beforeEach(() => cy.visit('/admin/dashboard'));

  it('should display the dashboard title in english', () => {
    cy.get('.header-actions > ul > li:nth-child(1) > button').should(
      'be.disabled'
    );
    cy.get('h1').should('contain', 'Dashboard');
  });

  it('should display the dashboard title in french', () => {
    // click on the french language switcher
    cy.get('.header-actions > ul > li:nth-child(2) > button').click();
    cy.get('h1').should('contain', 'Tableau de bord');
  });

  it('should be able to click on "view sessions" button', () => {
    // Get application name and application version from the card header (e.g. "Application - 0.0.0"
    cy.get(':nth-child(1) > .card > .card-header')
      .invoke('text')
      .then((text) => {
        const application = text.split(' - ');

        // Get application name from the card header
        const applicationName = application[0].trim();
        // Get application version from the card header
        const applicationVersion = application[1].trim();

        cy.get(':nth-child(1) > .card > .card-footer > .btn').click();
        // check if url is /admin/applications/<applicationName>/<applicationVersion>/sessions
        cy.url().should(
          'include',
          `/admin/applications/${applicationName}/${applicationVersion}/sessions`
        );
      });
  });
});
