describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display the dashboard page', () => {
    // check if url is /admin/dashboard
    cy.url().should('include', '/admin/dashboard');
  });
});
