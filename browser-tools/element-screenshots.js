// @ts-check
const { chromium } = require('@playwright/test');

/**
 * This script takes screenshots of specific elements in the application
 * Useful for documentation or component-level visual testing
 */
async function captureElementScreenshots() {
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
    
    // Take screenshots of specific elements
    
    // 1. Header
    console.log('Taking screenshot of the header...');
    const header = await page.locator('header').first();
    await header.screenshot({ path: './screenshots/header.png' });
    
    // 2. Add Puppy Form
    console.log('Taking screenshot of the add puppy form...');
    const addPuppyForm = await page.locator('form').first();
    await addPuppyForm.screenshot({ path: './screenshots/add-puppy-form.png' });
    
    // 3. Puppy List (if any puppies exist)
    const puppyListExists = await page.locator('[data-cy="puppy-list"]').count() > 0;
    if (puppyListExists) {
      console.log('Taking screenshot of the puppy list...');
      const puppyList = await page.locator('[data-cy="puppy-list"]').first();
      await puppyList.screenshot({ path: './screenshots/puppy-list.png' });
    } else {
      console.log('No puppy list found to screenshot');
    }
    
    // 4. Navigation Menu
    console.log('Taking screenshot of the navigation menu...');
    const navMenu = await page.locator('nav').first();
    await navMenu.screenshot({ path: './screenshots/nav-menu.png' });
    
    // Navigate to other pages and take element screenshots
    
    // History page - date picker
    console.log('Navigating to the history page...');
    await page.getByRole('link', { name: 'History' }).click();
    await page.waitForLoadState('networkidle');
    
    const datePicker = await page.locator('#date-select').first();
    if (await datePicker.count() > 0) {
      console.log('Taking screenshot of the date picker...');
      await datePicker.screenshot({ path: './screenshots/date-picker.png' });
    }
    
    // Statistics page - charts
    console.log('Navigating to the statistics page...');
    await page.getByRole('link', { name: 'Statistics' }).click();
    await page.waitForLoadState('networkidle');
    
    const charts = await page.locator('.chart-container').first();
    if (await charts.count() > 0) {
      console.log('Taking screenshot of the charts...');
      await charts.screenshot({ path: './screenshots/statistics-chart.png' });
    }
    
    // Search page - search form
    console.log('Navigating to the search page...');
    await page.getByRole('link', { name: 'Search' }).click();
    await page.waitForLoadState('networkidle');
    
    const searchForm = await page.locator('form').first();
    if (await searchForm.count() > 0) {
      console.log('Taking screenshot of the search form...');
      await searchForm.screenshot({ path: './screenshots/search-form.png' });
    }
    
    console.log('Element screenshots captured successfully!');
  } catch (error) {
    console.error('Error capturing element screenshots:', error);
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
captureElementScreenshots();
