// @ts-check
const { chromium } = require('@playwright/test');

/**
 * This script generates a PDF report of the current waiting list
 * Useful for printing or sharing reports
 */
async function generatePdfReport() {
  // Launch the browser
  const browser = await chromium.launch({
    headless: true // Must be true for PDF generation
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
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    console.log(`Using app URL: ${appUrl}`);
    await page.goto(appUrl);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Add a title and date to the page for the report
    await page.evaluate(() => {
      const reportHeader = document.createElement('div');
      reportHeader.style.textAlign = 'center';
      reportHeader.style.padding = '20px';
      reportHeader.style.backgroundColor = '#f0f0f0';
      reportHeader.style.marginBottom = '20px';

      const title = document.createElement('h1');
      title.textContent = '🐶 Puppy Spa - Daily Waiting List Report';
      title.style.color = '#333';

      const date = document.createElement('p');
      date.textContent = `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
      date.style.color = '#666';

      reportHeader.appendChild(title);
      reportHeader.appendChild(date);

      document.body.insertBefore(reportHeader, document.body.firstChild);

      // Add a footer
      const footer = document.createElement('div');
      footer.style.textAlign = 'center';
      footer.style.padding = '20px';
      footer.style.marginTop = '20px';
      footer.style.borderTop = '1px solid #ddd';
      footer.textContent = 'Puppy Spa Queue Management System - Confidential';

      document.body.appendChild(footer);
    });

    // Generate PDF
    console.log('Generating PDF report...');
    await page.pdf({
      path: './reports/waiting-list-report.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('PDF report generated successfully!');

  } catch (error) {
    console.error('Error generating PDF report:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Create the reports directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./reports')) {
  fs.mkdirSync('./reports');
}

// Run the function
generatePdfReport();
