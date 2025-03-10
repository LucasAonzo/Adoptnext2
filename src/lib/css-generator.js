/**
 * CSS Generator Helper
 * 
 * This file is used by the generate-css-variables.js script to
 * create CSS variables from the design tokens in ui.config.ts.
 * 
 * We're using a separate JS file to avoid TypeScript compilation issues.
 */

// Import the design tokens
const { ui } = require('./ui.config');

/**
 * Generates CSS variables from design tokens
 * @returns {string} CSS variables as a string
 */
function generateCssVariables() {
  let cssVars = '';
  
  // Generate font variables
  Object.entries(ui.typography.fontFamily).forEach(([key, value]) => {
    cssVars += `  --font-${key}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Generate color variables
  // Primary colors
  cssVars += `  --color-primary: ${ui.colors.primary.DEFAULT};\n`;
  cssVars += `  --color-primary-dark: ${ui.colors.primary.dark};\n`;
  cssVars += `  --color-primary-light: ${ui.colors.primary.light};\n`;
  cssVars += `  --color-primary-lighter: ${ui.colors.primary.lighter};\n\n`;
  
  // Secondary colors
  cssVars += `  --color-secondary: ${ui.colors.secondary.DEFAULT};\n`;
  cssVars += `  --color-secondary-dark: ${ui.colors.secondary.dark};\n`;
  cssVars += `  --color-secondary-light: ${ui.colors.secondary.light};\n\n`;
  
  // Accent colors
  cssVars += `  --color-accent: ${ui.colors.accent.DEFAULT};\n`;
  cssVars += `  --color-accent-dark: ${ui.colors.accent.dark};\n`;
  cssVars += `  --color-accent-light: ${ui.colors.accent.light};\n`;
  cssVars += `  --color-accent-teal: ${ui.colors.accent.teal};\n`;
  cssVars += `  --color-accent-pink: ${ui.colors.accent.pink};\n`;
  cssVars += `  --color-accent-green: ${ui.colors.accent.green};\n\n`;
  
  // Status colors
  cssVars += `  --color-success: ${ui.colors.status.success};\n`;
  cssVars += `  --color-warning: ${ui.colors.status.warning};\n`;
  cssVars += `  --color-error: ${ui.colors.status.error};\n`;
  cssVars += `  --color-info: ${ui.colors.status.info};\n\n`;
  
  // UI colors
  cssVars += `  --color-background: ${ui.colors.background};\n`;
  cssVars += `  --color-foreground: ${ui.colors.foreground};\n`;
  cssVars += `  --color-border: ${ui.colors.border};\n`;
  cssVars += `  --color-input: ${ui.colors.input};\n`;
  cssVars += `  --color-ring: ${ui.colors.ring};\n\n`;
  
  // Border radius
  Object.entries(ui.radius).forEach(([key, value]) => {
    const radiusKey = key === 'DEFAULT' ? 'radius' : `radius-${key}`;
    cssVars += `  --${radiusKey}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Shadows
  Object.entries(ui.shadows).forEach(([key, value]) => {
    const shadowKey = key === 'DEFAULT' ? 'shadow' : `shadow-${key}`;
    cssVars += `  --${shadowKey}: ${value};\n`;
  });
  
  return cssVars;
}

// Export the function for use in other files
module.exports = {
  generateCssVariables
}; 