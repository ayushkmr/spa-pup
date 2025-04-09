// Utility function to generate unique names
const uniqueId = () => `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

describe('Puppy Spa App', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
    // Wait for the page to load completely
    cy.contains('Today\'s Queue').should('be.visible');
  });

  describe('UI Elements', () => {
    it('should display the main page elements', () => {
      // Check if the header is displayed
      cy.get('nav').should('be.visible');
      cy.contains('Puppy Spa').should('be.visible');

      // Check if the waiting list section is displayed
      cy.contains('Today\'s Queue').should('be.visible');

      // Check if the add puppy form is displayed
      cy.contains('Add Puppy to Queue').should('be.visible');
    });

    it('should show form elements', () => {
      // Check if form elements are visible
      cy.get('#ownerName').should('be.visible');
      cy.get('#puppyName').should('be.visible');
      cy.get('#serviceRequired').should('be.visible');

      // Check if the submit button is visible
      cy.contains('button', 'Add to Queue').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should navigate to different pages', () => {
      // Navigate to the History page
      cy.contains('History').click();
      cy.url().should('include', '/history');

      // Navigate back to the home page
      cy.contains('Today\'s Queue').click();
      cy.url().should('not.include', '/history');

      // Navigate to the Statistics page
      cy.contains('Statistics').click();
      cy.url().should('include', '/statistics');

      // Navigate back to the home page
      cy.contains('Today\'s Queue').click();
      cy.url().should('not.include', '/statistics');

      // Navigate to the Add Puppy page
      cy.contains('Add Puppy').click();
      cy.url().should('include', '/add-puppy');

      // Navigate back to the home page
      cy.contains('Today\'s Queue').click();
      cy.url().should('not.include', '/add-puppy');

      // Navigate to the Search page
      cy.contains('Search').click();
      cy.url().should('include', '/search');

      // Navigate back to the home page
      cy.contains('Today\'s Queue').click();
      cy.url().should('not.include', '/search');
    });
  });

  describe('Form Validation', () => {
    it('should show validation messages when typing in form fields', () => {
      // Type a new owner name
      cy.get('#ownerName').type('New Owner');
      cy.contains('New owner will be created').should('be.visible');

      // Type a new puppy name
      cy.get('#puppyName').type('New Puppy');
      cy.contains('New puppy will be created').should('be.visible');

      // Clear the fields
      cy.get('#ownerName').clear();
      cy.get('#puppyName').clear();

      // Verify validation messages are gone
      cy.contains('New owner will be created').should('not.exist');
      cy.contains('New puppy will be created').should('not.exist');
    });

    it('should disable the submit button when required fields are empty', () => {
      // Initially, the button should be disabled
      cy.contains('button', 'Add to Queue').should('be.disabled');

      // Fill in only owner name
      cy.get('#ownerName').type('Test Owner');
      cy.contains('button', 'Add to Queue').should('be.disabled');

      // Fill in only puppy name
      cy.get('#ownerName').clear();
      cy.get('#puppyName').type('Test Puppy');
      cy.contains('button', 'Add to Queue').should('be.disabled');

      // Fill in both names but no service
      cy.get('#ownerName').type('Test Owner');
      cy.contains('button', 'Add to Queue').should('be.disabled');

      // Fill in all required fields
      cy.get('#serviceRequired').select('Bath & Dry');
      cy.contains('button', 'Add to Queue').should('not.be.disabled');
    });
  });

  describe('Form Submission', () => {
    it('should add a new puppy to the queue', () => {
      // Generate unique names to avoid conflicts
      const uniquePuppyName = `Puppy-${uniqueId()}`;
      const uniqueOwnerName = `Owner-${uniqueId()}`;

      // Fill in the form
      cy.get('#ownerName').type(uniqueOwnerName);
      cy.get('#puppyName').type(uniquePuppyName);
      cy.get('#serviceRequired').select('Bath & Dry');

      // Submit the form
      cy.contains('button', 'Add to Queue').click();

      // Wait for the form to be processed
      cy.wait(1000);

      // Verify the puppy appears in the waiting list
      cy.contains(uniquePuppyName).should('be.visible');
      cy.contains(uniqueOwnerName).should('be.visible');
    });
  });

  describe('Waiting List Operations', () => {
    it('should mark a puppy as serviced', () => {
      // First add a puppy to the queue
      const uniquePuppyName = `Puppy-${uniqueId()}`;
      const uniqueOwnerName = `Owner-${uniqueId()}`;

      cy.get('#ownerName').type(uniqueOwnerName);
      cy.get('#puppyName').type(uniquePuppyName);
      cy.get('#serviceRequired').select('Bath & Dry');
      cy.contains('button', 'Add to Queue').click();

      // Wait for the puppy to appear in the list
      cy.contains(uniquePuppyName).should('be.visible');

      // Mark the puppy as serviced
      cy.contains('tr', uniquePuppyName).within(() => {
        cy.contains('Mark Serviced').click();
      });

      // Switch to the Serviced tab
      cy.contains('button', 'Serviced').click();

      // Verify the puppy appears in the serviced list
      cy.contains(uniquePuppyName).should('be.visible');
      cy.contains(uniqueOwnerName).should('be.visible');
    });
  });
});
