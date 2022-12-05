// describe('app', () => {
//   beforeEach(() => cy.visit('/'));

//   it('should display the dashboard page', () => {
//     // check if url is /admin/dashboard
//     cy.url().should('include', '/dashboard');
//   });

//   it('should display the date on the header', () => {
//     cy.get('.title-date').contains(/AM|PM/);
//   });

//   it('should change the date on the header when passing in FR', () => {
//     // Click on fr button
//     cy.get(':nth-child(2) > .btn').click();
//     cy.get('.title-date').contains(/\d{2}\/\d{2}\/\d{4} (\d{2}:\d{2})/);
//     // Click on en button
//     cy.get('.list-unstyled > :nth-child(1) > .btn').click();
//   });
// });
