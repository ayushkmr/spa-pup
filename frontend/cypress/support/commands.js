// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('addPuppyToQueue', (puppyName, ownerName, service, notes = '') => {
  cy.get('#ownerName').type(ownerName);
  cy.get('#puppyName').type(puppyName);
  cy.get('#serviceRequired').select(service);
  if (notes) {
    cy.get('#notes').type(notes);
  }
  cy.contains('button', 'Add to Queue').click();
  
  // Wait for the puppy to appear in the list
  cy.contains(puppyName, { timeout: 10000 }).should('be.visible');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
