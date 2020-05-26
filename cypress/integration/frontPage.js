/* global cy */
/* global Cypress */

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Front Page', () => {
  it('Contains clickable stories that are sent to ', function (done) {
    cy.visit('/');

    cy.get('a')
      .eq(1)
      .invoke('attr', 'href')
      .then(href => {
        const item = parseInt(href.split('=')[1], 10);

        // cy.visit(href);
        cy.get('a')
          .eq(1)
          .invoke('removeAttr', 'target')
          .click()
          .should(() => {
            expect(localStorage.getItem('HNR_VIEWED_STORIES_CACHE')).to.eq(JSON.stringify([item]));
          });

        cy.url().should('include', `/item?id=${item}`);
        cy.go('back')
          .location()
          .should((loc) => {
            expect(loc.pathname).to.eq('/')
          })
          .then(() => done());
      });
  });
});
