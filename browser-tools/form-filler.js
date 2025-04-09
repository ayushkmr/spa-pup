// @ts-check
const { chromium } = require('@playwright/test');

/**
 * This script automates filling out the puppy registration form
 * It can be used for testing or demo purposes
 */
async function fillPuppyForm() {
  // Launch the browser
  const browser = await chromium.launch({
    headless: false // Set to true for headless mode
  });
  
  // Create a new context
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  // Create a new page
  const page = await context.newPage();
  
  try {
    // Navigate to the application
    console.log('Navigating to the application...');
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Generate random data for the form
    const ownerName = `Owner ${Math.floor(Math.random() * 1000)}`;
    const puppyName = `Puppy ${Math.floor(Math.random() * 1000)}`;
    const services = ['Bath & Dry', 'Full Grooming', 'Nail Trimming', 'Ear Cleaning'];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const notes = `This is a test note for ${puppyName}`;
    
    // Fill out the form
    console.log(`Adding puppy: ${puppyName} (Owner: ${ownerName})`);
    await page.getByLabel('Owner Name').fill(ownerName);
    await page.getByLabel('Puppy Name').fill(puppyName);
    
    // Select a service
    await page.getByLabel('Service').click();
    await page.getByText(randomService).click();
    
    // Add notes
    await page.getByLabel('Notes').fill(notes);
    
    // Submit the form
    await page.getByRole('button', { name: 'Add to Queue' }).click();
    
    // Wait for confirmation
    await page.waitForSelector(`text=${puppyName} has been added to the waiting list`);
    
    console.log('Puppy added successfully!');
    
    // Take a screenshot of the result
    await page.screenshot({ path: './screenshots/puppy-added.png' });
    
  } catch (error) {
    console.error('Error filling puppy form:', error);
  } finally {
    // Pause to see the result before closing
    console.log('Waiting 5 seconds before closing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Close the browser
    await browser.close();
  }
}

// Create the screenshots directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./screenshots')) {
  fs.mkdirSync('./screenshots');
}

// Run the function
fillPuppyForm();
