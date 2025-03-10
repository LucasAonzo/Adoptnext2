/**
 * CSS Variables Generator Script
 * 
 * This script automatically extracts design tokens from ui.config.ts
 * and updates the CSS variables in globals.css.
 * 
 * Usage: 
 * - npm run generate-css
 * - It's also automatically run during build
 */

const fs = require('fs');
const path = require('path');

// File paths
const rootDir = path.resolve(__dirname, '..');
const cssGeneratorPath = path.join(rootDir, 'src', 'lib', 'css-generator.manual.js');
const globalsPath = path.join(rootDir, 'src', 'app', 'globals.css');

// Generate CSS variables using the manual helper
console.log('Generating CSS variables from manual CSS generator...');
let cssVariables;
try {
  const cssGenerator = require('../src/lib/css-generator.manual');
  cssVariables = cssGenerator.generateCssVariables();
  console.log('Successfully generated CSS variables');
} catch (error) {
  console.error(`Error generating CSS variables: ${error.message}`);
  console.error('Make sure src/lib/css-generator.manual.js exists and is correctly configured');
  process.exit(1);
}

// Read the existing globals.css file
console.log('Reading globals.css...');
let cssContent;
try {
  cssContent = fs.readFileSync(globalsPath, 'utf8');
} catch (error) {
  console.error(`Error reading globals.css: ${error.message}`);
  process.exit(1);
}

// Define markers for the theme section 
// (the part we want to update between @theme { and the closing })
const startMarker = '@theme {';
const endMarker = '}';

// Find the theme block in the CSS content
const startIndex = cssContent.indexOf(startMarker);
if (startIndex === -1) {
  console.error('Could not find the @theme block in globals.css');
  process.exit(1);
}

// Find the closing brace of the theme block
const endIndex = cssContent.indexOf(endMarker, startIndex);
if (endIndex === -1) {
  console.error('Could not find the closing brace of the @theme block');
  process.exit(1);
}

// Insert warning comment
const cssComment = `
  /* IMPORTANT: Do not edit these variables directly. 
   * Instead, update the values in src/lib/ui.config.ts 
   * Last generated: ${new Date().toISOString()}
   */
`;

// Create the new CSS content by:
// 1. Taking everything before the theme block
// 2. Adding the theme opening
// 3. Adding our comment
// 4. Adding the generated variables
// 5. Taking everything after the theme closing brace
const newCssContent = 
  cssContent.substring(0, startIndex + startMarker.length) + 
  cssComment +
  cssVariables + 
  cssContent.substring(endIndex);

// Write the updated content back to globals.css
console.log('Updating globals.css with generated variables...');
try {
  fs.writeFileSync(globalsPath, newCssContent);
  console.log('✅ CSS variables updated successfully!');
} catch (error) {
  console.error(`Error writing to globals.css: ${error.message}`);
  process.exit(1);
} 