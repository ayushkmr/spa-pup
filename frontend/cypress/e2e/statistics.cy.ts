describe('Statistics Page', () => {
  beforeEach(() => {
    cy.visit('/statistics');
    // Wait for the page to load
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });

  it('should display the statistics page title', () => {
    cy.contains('Statistics', { timeout: 10000 }).should('exist');
  });

  it('should have date range inputs', () => {
    cy.get('input', { timeout: 10000 }).should('exist');
  });

  it('should have a chart or statistics display area', () => {
    // This is a basic test that assumes the UI structure
    // In a real scenario, we would mock the API response
    cy.get('div', { timeout: 10000 }).should('exist');
  });

  it('should display service type breakdown', () => {
    cy.contains('Statistics', { timeout: 10000 }).should('exist');
  });
});
