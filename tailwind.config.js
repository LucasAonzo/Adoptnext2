/** 
 * @type {import('tailwindcss').Config} 
 * 
 * This configuration uses the tailwind.preset.js file which contains
 * all design tokens migrated from ui.config.ts.
 * This is part of the migration to a pure Tailwind CSS approach.
 */

const preset = require('./tailwind.preset.js');

module.exports = {
  presets: [preset],
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // We're keeping the legacy color classes for backward compatibility
      // during the migration process. These will be removed in subsequent steps.
      colors: {
        // Primary purple
        "adopt-purple": {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        // Teal accents
        "adopt-teal": {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        // Amber accents
        "adopt-amber": {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Gray shades
        "adopt-gray": {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      // These keyframes will be merged with those from the preset
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        slideDown: {
          from: { height: 0, opacity: 0 },
          to: { height: "var(--radix-collapsible-content-height)", opacity: 1 },
        },
        slideUp: {
          from: { height: "var(--radix-collapsible-content-height)", opacity: 1 },
          to: { height: 0, opacity: 0 },
        },
        "text-shimmer": {
          "0%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
          "100%": {
            "background-position": "0% 50%",
          },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
      // These animations will be merged with those from the preset
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slideDown": "slideDown 0.3s ease-out",
        "slideUp": "slideUp 0.3s ease-out",
        "text-shimmer": "text-shimmer 3s infinite",
        "slide-out-right": "slide-out-right 0.3s ease-out forwards",
      },
      // Additional shadows not in the preset
      boxShadow: {
        card: "0 2px 8px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.05)",
        purple: "0 3px 12px rgba(139, 92, 246, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 