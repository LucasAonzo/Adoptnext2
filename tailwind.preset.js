/**
 * Tailwind CSS Preset for Adopt Project
 * 
 * This preset contains all design tokens extracted from ui.config.ts
 * and is used to standardize the styling across the application.
 */

module.exports = {
  theme: {
    extend: {
      // Colors from ui.config.ts
      colors: {
        // Primary colors
        'primary': {
          DEFAULT: 'oklch(0.58 0.22 295)', // #8B5CF6
          light: 'oklch(0.67 0.18 292)',    // #A78BFA
          lighter: 'oklch(0.77 0.14 290)',  // #C4B5FD
          dark: 'oklch(0.52 0.26 293)',     // #7C3AED
        },
        // Complementary colors
        'complementary': {
          DEFAULT: 'oklch(0.80 0.13 80)',   // #F6C35C
          light: 'oklch(0.87 0.09 80)',     // #F8D693
          dark: 'oklch(0.75 0.16 80)',      // #F5AC28
        },
        // Accent colors
        'accent-teal': 'oklch(0.83 0.12 180)',     // #5CF6E3
        'accent-pink': 'oklch(0.70 0.18 0)',       // #F65C8B
        'accent-green': 'oklch(0.85 0.13 140)',    // #88F65C
        
        // Status colors
        'success': 'oklch(0.87 0.10 150)',  // #86EFAC
        'warning': 'oklch(0.90 0.08 90)',   // #FDE68A
        'error': 'oklch(0.80 0.10 20)',     // #FDA4AF
        'info': 'oklch(0.80 0.10 250)',     // #93C5FD
        
        // Theme colors for components using CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      
      // Typography from ui.config.ts
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
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
      
      // Border radius from ui.config.ts
      borderRadius: {
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
      
      // Shadows from ui.config.ts
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none",
      },
      
      // Spacing from ui.config.ts
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
      
      // Animation from ui.config.ts
      transitionDuration: {
        fast: "100ms",
        DEFAULT: "200ms",
        slow: "300ms",
        'very-slow': "500ms",
      },
      
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      
      // Animations
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-up": "slide-in-up 0.4s ease-out",
        "slide-in-down": "slide-in-down 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
      },
      
      // Screens from ui.config.ts breakpoints
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
}; 