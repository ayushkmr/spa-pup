// @ts-check
const { chromium } = require('@playwright/test');

/**
 * This script tests the drag-and-drop functionality for reordering puppies in the queue
 */
async function testDragAndDrop() {
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
    
    // Check if there are at least 2 puppies in the list
    const puppyItems = await page.locator('[data-cy="puppy-item"]').count();
    
    if (puppyItems < 2) {
      console.log('Not enough puppies in the list to test drag and drop. Adding some...');
      
      // Add first puppy
      await page.getByLabel('Owner Name').fill('Owner A');
      await page.getByLabel('Puppy Name').fill('Puppy A');
      await page.getByLabel('Service').click();
      await page.getByText('Bath & Dry').click();
      await page.getByRole('button', { name: 'Add to Queue' }).click();
      await page.waitForTimeout(1000);
      
      // Add second puppy
      await page.getByLabel('Owner Name').fill('Owner B');
      await page.getByLabel('Puppy Name').fill('Puppy B');
      await page.getByLabel('Service').click();
      await page.getByText('Full Grooming').click();
      await page.getByRole('button', { name: 'Add to Queue' }).click();
      await page.waitForTimeout(1000);
    }
    
    // Take a screenshot before reordering
    console.log('Taking screenshot before reordering...');
    await page.screenshot({ path: './screenshots/before-reorder.png' });
    
    // Perform drag and drop
    console.log('Performing drag and drop...');
    
    // Get the first two puppy items
    const firstPuppy = await page.locator('[data-cy="puppy-item"]').first();
    const secondPuppy = await page.locator('[data-cy="puppy-item"]').nth(1);
    
    // Get the bounding boxes
    const firstBox = await firstPuppy.boundingBox();
    const secondBox = await secondPuppy.boundingBox();
    
    if (firstBox && secondBox) {
      // Drag the first puppy to the position of the second puppy
      await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2, { steps: 10 });
      await page.mouse.up();
      
      // Wait for the reordering to take effect
      await page.waitForTimeout(1000);
      
      // Take a screenshot after reordering
      console.log('Taking screenshot after reordering...');
      await page.screenshot({ path: './screenshots/after-reorder.png' });
      
      console.log('Drag and drop test completed!');
    } else {
      console.error('Could not get bounding boxes for puppy items');
    }
    
  } catch (error) {
    console.error('Error testing drag and drop:', error);
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
testDragAndDrop();
