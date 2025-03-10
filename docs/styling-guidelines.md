# Styling Guidelines: Adopt Project

This document outlines the styling approach and standards for the Adopt project, which uses Tailwind CSS for all styling needs.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing](#spacing)
5. [Component Patterns](#component-patterns)
6. [Responsive Design](#responsive-design)
7. [Animation & Transitions](#animation--transitions)
8. [Best Practices](#best-practices)
9. [Migration Notes](#migration-notes)

---

## Core Principles

The Adopt project follows these core styling principles:

1. **Pure Tailwind CSS**: All styling should use Tailwind utility classes directly in JSX
2. **Theme Consistency**: Use the theme colors and tokens defined in our Tailwind preset
3. **Accessibility First**: Ensure all components meet WCAG 2.1 AA standards
4. **Responsive Design**: All components should work across all viewport sizes
5. **Progressive Enhancement**: Components should work without JavaScript where possible

---

## Color System

### Primary Colors

Our primary color palette is based on a purple theme:

```jsx
// Primary
bg-primary            // Default primary color
bg-primary-light      // Lighter shade
bg-primary-lighter    // Even lighter shade
bg-primary-dark       // Darker shade

// With opacity modifiers
bg-primary/80         // Primary with 80% opacity
bg-primary-lighter/20 // Lighter primary with 20% opacity
```

### Complementary Colors

```jsx
// Complementary (amber/gold)
bg-complementary      // Default complementary color
bg-complementary/20   // With 20% opacity
```

### Accent Colors

```jsx
// Accent colors
bg-accent-teal
bg-accent-pink
bg-accent-green
```

### Status Colors

```jsx
// Status colors
bg-success            // Success states
bg-warning            // Warning states
bg-error              // Error states
bg-info               // Informational states
```

### Text Colors

Use semantic color names with opacity modifiers for text:

```jsx
// Text colors
text-foreground       // Default text color (100% opacity)
text-foreground/90    // 90% opacity - for headings
text-foreground/80    // 80% opacity - for subheadings
text-foreground/70    // 70% opacity - for body text
text-foreground/60    // 60% opacity - for secondary text
text-foreground/50    // 50% opacity - for disabled text
```

---

## Typography

### Font Sizes

```jsx
text-xs      // 12px
text-sm      // 14px
text-base    // 16px (default)
text-lg      // 18px
text-xl      // 20px
text-2xl     // 24px
text-3xl     // 30px
text-4xl     // 36px
text-5xl     // 48px
```

### Font Weights

```jsx
font-normal    // 400
font-medium    // 500
font-semibold  // 600
font-bold      // 700
```

### Line Heights

```jsx
leading-none     // 1
leading-tight    // 1.25
leading-snug     // 1.375
leading-normal   // 1.5
leading-relaxed  // 1.625
leading-loose    // 2
```

---

## Spacing

Use Tailwind's spacing scale for consistency:

```jsx
p-0   // 0
p-1   // 0.25rem (4px)
p-2   // 0.5rem (8px)
p-3   // 0.75rem (12px)
p-4   // 1rem (16px)
p-5   // 1.25rem (20px)
p-6   // 1.5rem (24px)
p-8   // 2rem (32px)
p-10  // 2.5rem (40px)
p-12  // 3rem (48px)
// etc.
```

Apply the same scale to:
- Margins (`m-*`)
- Padding (`p-*`)
- Gap (`gap-*`)
- Width/height (`w-*`/`h-*`)

---

## Component Patterns

### Button Variants

```jsx
// Default button
<Button className="bg-primary text-white hover:bg-primary-dark" />

// Secondary button
<Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80" />

// Outline button
<Button className="border border-input bg-background hover:bg-primary-lighter/20 hover:text-primary" />

// Ghost button
<Button className="hover:bg-primary-lighter/20 hover:text-primary" />
```

### Card Pattern

```jsx
<div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6">
  {/* Card content */}
</div>
```

### Form Elements Pattern

```jsx
<div className="space-y-2">
  <Label htmlFor="input-id" className="text-foreground/80">Label Text</Label>
  <Input 
    id="input-id"
    className="border-input focus-visible:ring-primary-lighter" 
  />
  {error && <p className="text-error text-sm">{error}</p>}
</div>
```

---

## Responsive Design

Use Tailwind's responsive prefixes for different viewport sizes:

```jsx
<div className="
  w-full           /* Mobile first (default) */
  sm:w-1/2         /* Small screens (640px+) */
  md:w-1/3         /* Medium screens (768px+) */
  lg:w-1/4         /* Large screens (1024px+) */
  xl:w-1/5         /* Extra large screens (1280px+) */
">
  Content
</div>
```

Common responsive patterns:

```jsx
// Column to row layout
<div className="flex flex-col md:flex-row">

// Adjusting text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Stack to grid
<div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3">

// Hiding/showing elements
<div className="hidden md:block">                /* Hide on mobile */
<div className="md:hidden">                     /* Hide on desktop */
```

---

## Animation & Transitions

### Transition Durations

```jsx
duration-fast      // 100ms
duration-DEFAULT   // 200ms
duration-slow      // 300ms
duration-very-slow // 500ms
```

### Transition Timing

```jsx
ease-DEFAULT   // cubic-bezier(0.4, 0, 0.2, 1)
ease-in        // cubic-bezier(0.4, 0, 1, 1)
ease-out       // cubic-bezier(0, 0, 0.2, 1)
ease-in-out    // cubic-bezier(0.4, 0, 0.2, 1)
ease-elastic   // cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Transition Delay

```jsx
delay-50       // 50ms delay
delay-100      // 100ms delay
delay-150      // 150ms delay
delay-200      // 200ms delay
delay-300      // 300ms delay
delay-500      // 500ms delay
delay-700      // 700ms delay
```

### Animation Examples

```jsx
// Hover lift effect
<div className="hover:translate-y-[-2px] transition-transform duration-200">

// Fade-in effect
<div className="opacity-0 animate-fade-in">

// Slide-up effect
<div className="translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
```

---

## Best Practices

### Class Organization

1. **Layout Properties**: Position, display, width, height
2. **Spacing**: Margin, padding, gap 
3. **Typography**: Font size, weight, color, alignment
4. **Visual Styles**: Background, border, shadow
5. **Interactive States**: Hover, focus, active
6. **Transitions & Animations**: Transitions, animations

Example:
```jsx
<div className="
  /* Layout */
  relative flex flex-col
  /* Spacing */
  p-4 gap-2 
  /* Typography */
  text-lg font-medium text-foreground
  /* Visual */
  bg-white rounded-lg border border-border shadow-sm 
  /* Interactive */
  hover:border-primary-lighter focus-within:ring-2 focus-within:ring-primary-lighter
  /* Transitions */
  transition-all duration-200
">
```

### When to Use Inline Styles

Use inline styles sparingly and only for truly dynamic values that cannot be predetermined:

```jsx
// Good: Dynamic values from props
<div style={{ width: `${width}px`, height: `${height}px` }}>

// Bad: Static values that could be Tailwind classes
<div style={{ backgroundColor: '#8B5CF6', padding: '16px' }}>
```

### Using the `cn()` Utility

Always use the `cn()` utility from `@/lib/utils` to conditionally merge classes:

```jsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base classes",
  condition && "conditional classes",
  className // Pass through className prop
)}>
```

---

## Migration Notes

This project recently underwent a migration from mixed styling approaches (Tailwind CSS + CVA + inline styles with ui.config.ts) to a pure Tailwind CSS implementation.

If you find any legacy styles that don't follow these guidelines, please update them according to this document.

Key changes during migration:

1. Removed CVA dependency and replaced with conditional Tailwind classes
2. Converted inline styles referencing ui.config.ts to Tailwind utility classes
3. Replaced CSS variable references with Tailwind theme colors
4. Added custom utilities for transitions and animations

For more details, see the [Migration Plan](./migration-plan.md) document. 