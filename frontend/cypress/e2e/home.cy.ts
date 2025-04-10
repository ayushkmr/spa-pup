describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for the page to load
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });

  it('should display the title', () => {
    cy.contains('Puppy Spa', { timeout: 10000 }).should('exist');
  });

  it('should have a Today\'s Queue section', () => {
    cy.contains('Today\'s Queue', { timeout: 10000 }).should('exist');
  });

  it('should have a Pampered Pups gallery', () => {
    cy.contains('Pampered Pups', { timeout: 10000 }).should('exist');
  });

  it('should have a form to add puppies to the queue', () => {
    cy.get('form', { timeout: 10000 }).should('exist');
    cy.contains('Add to Queue', { timeout: 10000 }).should('exist');
  });
});
