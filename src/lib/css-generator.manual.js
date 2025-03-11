/**
 * Manual CSS Generator Helper 
 * 
 * This file is a manual duplicate of the CSS generation logic in ui.config.ts
 * We're using this approach to avoid TypeScript compilation issues in the Node.js script.
 */

// Manually define the same design tokens that exist in ui.config.ts
const ui = {
  colors: {
    // Primary purple
    primary: {
      DEFAULT: "oklch(0.58 0.22 295)", // #8B5CF6
      light: "oklch(0.67 0.18 292)",    // #A78BFA
      lighter: "oklch(0.77 0.14 290)",  // #C4B5FD
      dark: "oklch(0.52 0.26 293)",     // #7C3AED
    },
    // Secondary teal
    secondary: {
      DEFAULT: "oklch(0.75 0.15 180)", // #14B8A6
      light: "oklch(0.85 0.11 180)",    // #5EEAD4
      dark: "oklch(0.65 0.15 180)",     // #0D9488
    },
    // Accent colors
    accent: {
      DEFAULT: "oklch(0.80 0.13 80)",  // #F59E0B
      light: "oklch(0.87 0.09 80)",     // #FCD34D
      dark: "oklch(0.75 0.16 80)",      // #D97706
      teal: "oklch(0.83 0.12 180)",     // #5CF6E3
      pink: "oklch(0.70 0.18 0)",       // #F65C8B
      green: "oklch(0.85 0.13 140)",    // #88F65C
    },
    // Status colors
    status: {
      success: "oklch(0.87 0.10 150)",  // #86EFAC
      warning: "oklch(0.90 0.08 90)",   // #FDE68A
      error: "oklch(0.80 0.10 20)",     // #FDA4AF
      info: "oklch(0.80 0.10 250)",     // #93C5FD
    },
    // Background and foreground
    background: "oklch(0.98 0.01 300)", // #F8F7FB
    foreground: "oklch(0.30 0.03 285)", // #262338
    border: "oklch(0.91 0.00 0)",       // #E5E7EB
    input: "oklch(0.91 0.00 0)",        // #E5E7EB
    ring: "oklch(0.67 0.18 292)",       // #A78BFA
    
    // Adopt color system with explicit shades
    adopt: {
      // Purple palette - based on primary colors
      purple: {
        50: "oklch(0.98 0.02 295)",     // #F5F3FF
        100: "oklch(0.95 0.04 295)",    // #EDE9FE
        200: "oklch(0.90 0.08 295)",    // #DDD6FE
        300: "oklch(0.77 0.14 290)",    // #C4B5FD 
        400: "oklch(0.67 0.18 292)",    // #A78BFA
        500: "oklch(0.58 0.22 295)",    // #8B5CF6
        600: "oklch(0.52 0.26 293)",    // #7C3AED
        700: "oklch(0.47 0.24 290)",    // #6D28D9
        800: "oklch(0.40 0.21 290)",    // #5B21B6
        900: "oklch(0.33 0.18 290)",    // #4C1D95
        950: "oklch(0.25 0.15 290)",    // #2E1065
      },
      // Teal palette - based on secondary colors
      teal: {
        50: "oklch(0.97 0.02 180)",     // #F0FDFA
        100: "oklch(0.93 0.05 180)",    // #CCFBF1
        200: "oklch(0.90 0.08 180)",    // #99F6E4
        300: "oklch(0.85 0.11 180)",    // #5EEAD4
        400: "oklch(0.80 0.13 180)",    // #2DD4BF
        500: "oklch(0.75 0.15 180)",    // #14B8A6
        600: "oklch(0.65 0.15 180)",    // #0D9488
        700: "oklch(0.55 0.13 180)",    // #0F766E
        800: "oklch(0.45 0.10 180)",    // #115E59
        900: "oklch(0.35 0.08 180)",    // #134E4A
      },
      // Amber palette - based on accent colors
      amber: {
        50: "oklch(0.97 0.02 80)",      // #FFFBEB
        100: "oklch(0.94 0.04 80)",     // #FEF3C7
        200: "oklch(0.90 0.08 80)",     // #FDE68A
        300: "oklch(0.87 0.09 80)",     // #FCD34D
        400: "oklch(0.84 0.11 80)",     // #FBBF24
        500: "oklch(0.80 0.13 80)",     // #F59E0B
        600: "oklch(0.75 0.16 80)",     // #D97706
        700: "oklch(0.70 0.15 80)",     // #B45309
        800: "oklch(0.65 0.14 80)",     // #92400E
        900: "oklch(0.55 0.12 80)",     // #78350F
      },
      // Gray palette with slight purple tint
      gray: {
        50: "oklch(0.98 0.01 290)",     // #F8F7FA
        100: "oklch(0.95 0.02 290)",    // #F1EFF5
        200: "oklch(0.90 0.03 290)",    // #E4E0ED
        300: "oklch(0.85 0.04 290)",    // #D1CAE0
        400: "oklch(0.70 0.05 290)",    // #9E95B3
        500: "oklch(0.55 0.04 290)",    // #6B6684
        600: "oklch(0.45 0.03 290)",    // #4A4659
        700: "oklch(0.35 0.02 290)",    // #37344A
        800: "oklch(0.25 0.02 290)",    // #25223A
        900: "oklch(0.15 0.01 290)",    // #181624
      },
    }
  },
  
  typography: {
    fontFamily: {
      sans: "Inter, sans-serif",
      display: "Montserrat, sans-serif",
    },
  },
  
  radius: {
    none: "0",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "none",
  },
};

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