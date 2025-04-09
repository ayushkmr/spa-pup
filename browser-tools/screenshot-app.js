// @ts-check
const { chromium } = require('@playwright/test');

/**
 * This script takes screenshots of the Puppy Spa application in different states
 * It can be used for documentation, testing, or visual regression testing
 */
async function captureScreenshots() {
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
    
    // Take a screenshot of the home page
    console.log('Taking screenshot of the home page...');
    await page.screenshot({ path: './screenshots/home-page.png', fullPage: true });
    
    // Navigate to other pages and take screenshots
    // History page
    console.log('Navigating to the history page...');
    await page.getByRole('link', { name: 'History' }).click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './screenshots/history-page.png', fullPage: true });
    
    // Statistics page
    console.log('Navigating to the statistics page...');
    await page.getByRole('link', { name: 'Statistics' }).click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './screenshots/statistics-page.png', fullPage: true });
    
    // Search page
    console.log('Navigating to the search page...');
    await page.getByRole('link', { name: 'Search' }).click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './screenshots/search-page.png', fullPage: true });
    
    console.log('Screenshots captured successfully!');
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
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
captureScreenshots();
