/**
 * UI Kit Configuration - Single Source of Truth
 * 
 * This file contains all design tokens for the application and
 * is used to generate both Tailwind CSS configuration and CSS variables.
 */

// Type definitions for design tokens
type ColorToken = string;
type SpacingToken = string;
type FontToken = string;
type RadiusToken = string;
type ShadowToken = string;
type DurationToken = string;
type EasingToken = string;

// Main design system tokens
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
  
  animation: {
    duration: {
      fast: "100ms",
      default: "200ms",
      slow: "300ms",
      verySlow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
  
  typography: {
    fontFamily: {
      sans: "Inter, sans-serif",
      display: "Montserrat, sans-serif",
    },
    fontSize: {
      xs: "0.75rem",     // 12px
      sm: "0.875rem",    // 14px
      base: "1rem",      // 16px
      lg: "1.125rem",    // 18px
      xl: "1.25rem",     // 20px
      "2xl": "1.5rem",   // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
      "5xl": "3rem",     // 48px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },
  
  spacing: {
    px: "1px",
    0: "0",
    0.5: "0.125rem",
    1: "0.25rem", 
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
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
  
  // Common breakpoints
  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

/**
 * Export color hex values for reference
 * These are automatically converted from OKLCH values
 */
const colorHexValues = {
  primary: "#8B5CF6",
  primaryLight: "#A78BFA",
  primaryLighter: "#C4B5FD",
  primaryDark: "#7C3AED",
  secondary: "#14B8A6",
  secondaryLight: "#5EEAD4",
  secondaryDark: "#0D9488",
  accent: "#F59E0B",
  accentLight: "#FCD34D",
  accentDark: "#D97706",
  accentTeal: "#5CF6E3",
  accentPink: "#F65C8B",
  accentGreen: "#88F65C",
  success: "#86EFAC",
  warning: "#FDE68A",
  error: "#FDA4AF",
  info: "#93C5FD",
  background: "#F8F7FB",
  foreground: "#262338",
  border: "#E5E7EB",
  input: "#E5E7EB",
  ring: "#A78BFA",
};

/**
 * Generate CSS variables from design tokens
 * These will be used in @theme block in globals.css
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
  
  // Generate adopt color scale variables
  // Purple scale
  cssVars += `  /* Adopt purple scale */\n`;
  Object.entries(ui.colors.adopt.purple).forEach(([shade, value]) => {
    cssVars += `  --color-adopt-purple-${shade}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Teal scale
  cssVars += `  /* Adopt teal scale */\n`;
  Object.entries(ui.colors.adopt.teal).forEach(([shade, value]) => {
    cssVars += `  --color-adopt-teal-${shade}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Amber scale
  cssVars += `  /* Adopt amber scale */\n`;
  Object.entries(ui.colors.adopt.amber).forEach(([shade, value]) => {
    cssVars += `  --color-adopt-amber-${shade}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Gray scale
  cssVars += `  /* Adopt gray scale */\n`;
  Object.entries(ui.colors.adopt.gray).forEach(([shade, value]) => {
    cssVars += `  --color-adopt-gray-${shade}: ${value};\n`;
  });
  cssVars += '\n';
  
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

/**
 * Generate Tailwind CSS configuration from design tokens
 * This will be imported in tailwind.config.js
 */
function getTailwindTheme() {
  return {
    colors: {
      primary: {
        DEFAULT: "var(--color-primary)",
        dark: "var(--color-primary-dark)",
        light: "var(--color-primary-light)",
        lighter: "var(--color-primary-lighter)",
      },
      secondary: {
        DEFAULT: "var(--color-secondary)",
        dark: "var(--color-secondary-dark)",
        light: "var(--color-secondary-light)",
      },
      accent: {
        DEFAULT: "var(--color-accent)",
        dark: "var(--color-accent-dark)",
        light: "var(--color-accent-light)",
        teal: "var(--color-accent-teal)",
        pink: "var(--color-accent-pink)",
        green: "var(--color-accent-green)",
      },
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      error: "var(--color-error)",
      info: "var(--color-info)",
      background: "var(--color-background)",
      foreground: "var(--color-foreground)",
      border: "var(--color-border)",
      input: "var(--color-input)",
      ring: "var(--color-ring)",
      
      // Add the adopt namespace with all color variants
      adopt: {
        purple: {
          50: ui.colors.adopt.purple[50],
          100: ui.colors.adopt.purple[100],
          200: ui.colors.adopt.purple[200],
          300: ui.colors.adopt.purple[300],
          400: ui.colors.adopt.purple[400],
          500: ui.colors.adopt.purple[500],
          600: ui.colors.adopt.purple[600],
          700: ui.colors.adopt.purple[700],
          800: ui.colors.adopt.purple[800],
          900: ui.colors.adopt.purple[900],
          950: ui.colors.adopt.purple[950],
        },
        teal: {
          50: ui.colors.adopt.teal[50],
          100: ui.colors.adopt.teal[100],
          200: ui.colors.adopt.teal[200],
          300: ui.colors.adopt.teal[300],
          400: ui.colors.adopt.teal[400],
          500: ui.colors.adopt.teal[500],
          600: ui.colors.adopt.teal[600],
          700: ui.colors.adopt.teal[700],
          800: ui.colors.adopt.teal[800],
          900: ui.colors.adopt.teal[900],
        },
        amber: {
          50: ui.colors.adopt.amber[50],
          100: ui.colors.adopt.amber[100],
          200: ui.colors.adopt.amber[200],
          300: ui.colors.adopt.amber[300],
          400: ui.colors.adopt.amber[400],
          500: ui.colors.adopt.amber[500],
          600: ui.colors.adopt.amber[600],
          700: ui.colors.adopt.amber[700],
          800: ui.colors.adopt.amber[800],
          900: ui.colors.adopt.amber[900],
        },
        gray: {
          50: ui.colors.adopt.gray[50],
          100: ui.colors.adopt.gray[100],
          200: ui.colors.adopt.gray[200],
          300: ui.colors.adopt.gray[300],
          400: ui.colors.adopt.gray[400],
          500: ui.colors.adopt.gray[500],
          600: ui.colors.adopt.gray[600],
          700: ui.colors.adopt.gray[700],
          800: ui.colors.adopt.gray[800],
          900: ui.colors.adopt.gray[900],
        },
      },
    },
    fontFamily: {
      sans: ["var(--font-sans)"],
      display: ["var(--font-display)"],
    },
    borderRadius: {
      none: "var(--radius-none)",
      sm: "var(--radius-sm)",
      DEFAULT: "var(--radius)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      "2xl": "var(--radius-2xl)",
      "3xl": "var(--radius-3xl)",
      full: "var(--radius-full)",
    },
    boxShadow: {
      sm: "var(--shadow-sm)",
      DEFAULT: "var(--shadow)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
      xl: "var(--shadow-xl)",
      "2xl": "var(--shadow-2xl)",
      inner: "var(--shadow-inner)",
      none: "var(--shadow-none)",
    },
    extend: {
      fontSize: ui.typography.fontSize,
      fontWeight: ui.typography.fontWeight,
      lineHeight: ui.typography.lineHeight,
      letterSpacing: ui.typography.letterSpacing,
      spacing: ui.spacing,
      transitionDuration: {
        fast: ui.animation.duration.fast,
        DEFAULT: ui.animation.duration.default,
        slow: ui.animation.duration.slow,
        "very-slow": ui.animation.duration.verySlow,
      },
      transitionTimingFunction: {
        DEFAULT: ui.animation.easing.default,
        in: ui.animation.easing.in,
        out: ui.animation.easing.out,
        "in-out": ui.animation.easing.inOut,
        elastic: ui.animation.easing.elastic,
      },
      screens: ui.breakpoints,
    },
  };
}

// Export all for use in TypeScript projects
module.exports = {
  ui,
  colorHexValues,
  generateCssVariables,
  getTailwindTheme
}; 