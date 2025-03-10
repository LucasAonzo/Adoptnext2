/**
 * Tailwind CSS Preset for Adopt Project
 * 
 * This preset contains all design tokens extracted from ui.config.ts
 * and is used to standardize the styling across the application.
 */

const plugin = require('tailwindcss/plugin');

module.exports = {
  theme: {
    extend: {
      // Colors from ui.config.ts
      // ... existing colors

      // Typography from ui.config.ts
      // ... existing typography

      // Border radius from ui.config.ts
      // ... existing border radius
      
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
        // Custom pet card shadows
        'pet': '0 8px 20px rgba(139, 92, 246, 0.15)',
        'pet-sm': '0 4px 15px rgba(139, 92, 246, 0.1)',
      },
      
      // Text shadow utility
      textShadow: {
        sm: '0 1px 1px rgba(0,0,0,0.2)',
        DEFAULT: '0 1px 2px rgba(0,0,0,0.3)',
        lg: '0 2px 4px rgba(0,0,0,0.4)',
      },
      
      // Spacing from ui.config.ts
      // ... existing spacing
      
      // Animation from ui.config.ts
      // ... existing animations
      
      // Screens from ui.config.ts breakpoints
      // ... existing screens
    },
  },
  plugins: [
    // Plugin to add text shadow utilities
    plugin(function({ addUtilities, theme }) {
      const textShadows = theme('textShadow');
      const utilities = Object.keys(textShadows).reduce((acc, key) => {
        const value = textShadows[key];
        const className = key === 'DEFAULT' ? '.text-shadow' : `.text-shadow-${key}`;
        return {
          ...acc,
          [className]: {
            'text-shadow': value,
          },
        };
      }, {});
      addUtilities(utilities);
    }),
  ],
}; 