/**
 * UI Kit Configuration
 * 
 * This file contains configuration for the UI kit, including colors,
 * spacing, animations, and typography.
 */

export const ui = {
  colors: {
    // Primary purple (requested color #8B5CF6)
    primary: {
      DEFAULT: "oklch(0.58 0.22 295)", // #8B5CF6
      light: "oklch(0.67 0.18 292)",    // #A78BFA
      lighter: "oklch(0.77 0.14 290)",  // #C4B5FD
      dark: "oklch(0.52 0.26 293)",     // #7C3AED
    },
    // Complementary colors (pastel orange tones)
    complementary: {
      DEFAULT: "oklch(0.80 0.13 80)",   // #F6C35C
      light: "oklch(0.87 0.09 80)",     // #F8D693
      dark: "oklch(0.75 0.16 80)",      // #F5AC28
    },
    // Accent colors (pastel variants)
    accent: {
      teal: "oklch(0.83 0.12 180)",     // #5CF6E3
      pink: "oklch(0.70 0.18 0)",       // #F65C8B
      green: "oklch(0.85 0.13 140)",    // #88F65C
    },
    // Status colors (pastel variants)
    status: {
      success: "oklch(0.87 0.10 150)",  // #86EFAC
      warning: "oklch(0.90 0.08 90)",   // #FDE68A
      error: "oklch(0.80 0.10 20)",     // #FDA4AF
      info: "oklch(0.80 0.10 250)",     // #93C5FD
    },
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
      sans: "var(--font-geist-sans)",
      mono: "var(--font-geist-mono)",
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
    // Define spacing scale
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
 * These can be used when you need exact hex values instead of CSS variables
 */
export const colorHexValues = {
  primary: "#8B5CF6",
  primaryLight: "#A78BFA",
  primaryLighter: "#C4B5FD",
  primaryDark: "#7C3AED",
  complementary: "#F6C35C",
  complementaryLight: "#F8D693",
  complementaryDark: "#F5AC28",
  accentTeal: "#5CF6E3",
  accentPink: "#F65C8B",
  accentGreen: "#88F65C",
  success: "#86EFAC",
  warning: "#FDE68A",
  error: "#FDA4AF",
  info: "#93C5FD",
}; 