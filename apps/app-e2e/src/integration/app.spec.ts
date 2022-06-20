describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display the dashboard page', () => {
    // check if url is /admin/dashboard
    cy.url().should('include', '/admin/dashboard');
  });

  it('should display the dashboard title in english', () => {
    // english switch should be disabled
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
});
