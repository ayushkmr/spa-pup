describe('Puppy Spa App', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should display the main page elements', () => {
    // Check if the header is displayed
    cy.get('header').should('be.visible');
    cy.contains('Puppy Spa').should('be.visible');

    // Check if the puppy gallery is displayed
    cy.contains('Our Pampered Pups').should('be.visible');

    // Check if the waiting list section is displayed
    cy.contains('Today\'s Puppy Queue').should('be.visible');

    // Check if the add puppy form is displayed
    cy.contains('Add Puppy to Queue').should('be.visible');
  });

  it('should navigate to different pages', () => {
    // Navigate to the Add Puppy page
    cy.contains('Add Puppy').click();
    cy.url().should('include', '/add-puppy');
    cy.contains('Register a New Puppy').should('be.visible');

    // Navigate back to the home page
    cy.contains('Home').click();
    cy.url().should('not.include', '/add-puppy');
    cy.contains('Today\'s Puppy Queue').should('be.visible');

    // Navigate to the Add Entry page
    cy.contains('Add Entry').click();
    cy.url().should('include', '/add-entry');
    cy.contains('Add to Waiting List').should('be.visible');

    // Navigate back to the home page
    cy.contains('Home').click();
    cy.url().should('not.include', '/add-entry');
  });

  it('should add a new puppy to the queue', () => {
    // Generate a unique puppy name using timestamp
    const uniquePuppyName = `TestPuppy${Date.now()}`;
    const ownerName = 'Test Owner';

    // Fill in the form
    cy.get('input[name="ownerName"]').type(ownerName);
    cy.get('input[name="puppyName"]').type(uniquePuppyName);
    cy.get('select[name="serviceRequired"]').select('Bath & Dry');

    // Submit the form
    cy.contains('button', 'Add to Queue').click();

    // Check if success message is displayed
    cy.contains('Puppy added to queue successfully').should('be.visible');

    // Check if the puppy appears in the waiting list
    cy.contains(uniquePuppyName).should('be.visible');
    cy.contains(ownerName).should('be.visible');
    cy.contains('Bath & Dry').should('be.visible');
  });

  it('should mark a puppy as serviced', () => {
    // Generate a unique puppy name using timestamp
    const uniquePuppyName = `TestPuppy${Date.now()}`;
    const ownerName = 'Test Owner';

    // Add a puppy to the queue
    cy.get('input[name="ownerName"]').type(ownerName);
    cy.get('input[name="puppyName"]').type(uniquePuppyName);
    cy.get('select[name="serviceRequired"]').select('Bath & Dry');
    cy.contains('button', 'Add to Queue').click();

    // Wait for the puppy to appear in the waiting list
    cy.contains(uniquePuppyName).should('be.visible');

    // Mark the puppy as serviced
    cy.contains('tr', uniquePuppyName).within(() => {
      cy.contains('Mark Serviced').click();
    });

    // Switch to the Serviced tab
    cy.contains('button', 'Serviced').click();

    // Check if the puppy appears in the serviced list
    cy.contains(uniquePuppyName).should('be.visible');
    cy.contains(ownerName).should('be.visible');
    cy.contains('Bath & Dry').should('be.visible');
  });

  it('should show validation messages when typing puppy and owner names', () => {
    // Type a new owner name
    cy.get('input[name="ownerName"]').type('New Owner');
    
    // Check if the "New owner will be created" message is shown
    cy.contains('New owner will be created').should('be.visible');
    
    // Type a new puppy name
    cy.get('input[name="puppyName"]').type('New Puppy');
    
    // Check if the "New puppy will be created" message is shown
    cy.contains('New puppy will be created').should('be.visible');
  });
});
