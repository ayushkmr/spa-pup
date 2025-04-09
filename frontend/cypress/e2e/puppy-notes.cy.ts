// Utility function to generate unique names
const uniqueId = () => `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

describe('Puppy Notes Functionality', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
    // Wait for the page to load completely
    cy.contains('Today\'s Queue').should('be.visible');
  });

  it('should show notes field in the form', () => {
    // Check if the notes field is visible
    cy.get('#notes').should('be.visible');
  });

  it('should add a new puppy with notes to the queue', () => {
    // Generate unique names to avoid conflicts
    const uniquePuppyName = `Puppy-${uniqueId()}`;
    const uniqueOwnerName = `Owner-${uniqueId()}`;
    const notes = 'Sensitive to shampoo, be gentle';

    // Fill in the form
    cy.get('#ownerName').type(uniqueOwnerName);
    cy.get('#puppyName').type(uniquePuppyName);
    cy.get('#serviceRequired').select('Bath & Dry');
    cy.get('#notes').type(notes);

    // Submit the form
    cy.contains('button', 'Add to Queue').click();

    // Wait for the form to be processed
    cy.wait(1000);

    // Verify the puppy appears in the waiting list
    cy.contains(uniquePuppyName).should('be.visible');
    cy.contains(uniqueOwnerName).should('be.visible');
    
    // Verify the notes are displayed
    cy.contains(notes).should('be.visible');
  });

  it('should mark a puppy with notes as serviced and display notes in serviced tab', () => {
    // First add a puppy with notes to the queue
    const uniquePuppyName = `Puppy-${uniqueId()}`;
    const uniqueOwnerName = `Owner-${uniqueId()}`;
    const notes = 'Special conditioner needed';

    cy.get('#ownerName').type(uniqueOwnerName);
    cy.get('#puppyName').type(uniquePuppyName);
    cy.get('#serviceRequired').select('Full Grooming');
    cy.get('#notes').type(notes);
    cy.contains('button', 'Add to Queue').click();

    // Wait for the puppy to appear in the list
    cy.contains(uniquePuppyName).should('be.visible');
    cy.contains(notes).should('be.visible');

    // Mark the puppy as serviced
    cy.contains('tr', uniquePuppyName).within(() => {
      cy.contains('Mark Serviced').click();
    });

    // Switch to the Serviced tab
    cy.contains('button', /Serviced/).click();

    // Verify the puppy and notes appear in the serviced list
    cy.contains(uniquePuppyName).should('be.visible');
    cy.contains(uniqueOwnerName).should('be.visible');
    cy.contains(notes).should('be.visible');
  });
});
