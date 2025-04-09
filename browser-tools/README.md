# 🐶 Puppy Spa Browser Tools

This directory contains browser automation tools for the Puppy Spa application using Playwright. These tools can help with testing, documentation, and other browser-related tasks.

## 📋 Available Tools

### 1. Screenshot Generator (`screenshot-app.js`)

Takes screenshots of different pages in the application. Useful for documentation or visual regression testing.

```bash
node browser-tools/screenshot-app.js
```

### 2. Element Screenshot Generator (`element-screenshots.js`)

Takes screenshots of specific UI elements in the application. Useful for component-level documentation or visual testing.

```bash
node browser-tools/element-screenshots.js
```

### 3. Form Filler (`form-filler.js`)

Automates filling out the puppy registration form with random data. Useful for testing or demo purposes.

```bash
node browser-tools/form-filler.js
```

### 4. Drag and Drop Tester (`test-drag-drop.js`)

Tests the drag-and-drop functionality for reordering puppies in the queue. Adds test puppies if needed.

```bash
node browser-tools/test-drag-drop.js
```

### 5. PDF Report Generator (`generate-pdf-report.js`)

Generates a PDF report of the current waiting list. Useful for printing or sharing reports.

```bash
node browser-tools/generate-pdf-report.js
```

## 🚀 Getting Started

1. Make sure you have Playwright installed:
   ```bash
   npm install @playwright/test
   ```

2. Install browser dependencies:
   ```bash
   npx playwright install
   ```

3. Start your application:
   ```bash
   # Start the frontend
   cd frontend
   npm run dev

   # In another terminal, start the backend
   cd backend
   npm run start:dev
   ```

4. Run any of the browser tools:
   ```bash
   node browser-tools/screenshot-app.js
   ```

## 📁 Output Directories

- Screenshots are saved to the `screenshots` directory
- PDF reports are saved to the `reports` directory

These directories will be created automatically if they don't exist.

## 🛠️ Customization

You can modify these scripts to suit your specific needs:

- Change the viewport size by modifying the `viewport` parameter
- Adjust the headless mode by changing the `headless` parameter
- Modify the selectors if your application's structure changes
- Add new scripts for additional functionality

## 🧪 Using with Automated Testing

These tools can be integrated with your testing workflow:

1. Add scripts to your package.json:
   ```json
   "scripts": {
     "browser:screenshot": "node browser-tools/screenshot-app.js",
     "browser:element-screenshot": "node browser-tools/element-screenshots.js",
     "browser:form-fill": "node browser-tools/form-filler.js",
     "browser:drag-test": "node browser-tools/test-drag-drop.js",
     "browser:pdf-report": "node browser-tools/generate-pdf-report.js"
   }
   ```

2. Run as part of your CI/CD pipeline or development workflow:
   ```bash
   npm run browser:screenshot
   ```

## 📝 Notes

- These tools are designed to work with the Puppy Spa application
- They assume the application is running at http://localhost:3000
- Adjust the URLs if your application is running on a different port
