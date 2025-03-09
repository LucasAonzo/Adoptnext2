# AdoptMe UI Implementation Guidelines

This document outlines the comprehensive guidelines for implementing UI components and styling in the AdoptMe project. Following these guidelines ensures consistency, accessibility, and maintainability across the application.

## Table of Contents
1. [Technologies](#technologies)
2. [Configuration Steps](#configuration-steps)
3. [Design System](#design-system)
4. [Component Implementation](#component-implementation)
5. [Accessibility Guidelines](#accessibility-guidelines)
6. [Responsive Design](#responsive-design)
7. [Server-Side Rendering Considerations](#server-side-rendering-considerations)
8. [Implementation Checklist](#implementation-checklist)
9. [Implementation Progress](#implementation-progress)
10. [Example Implementations](#example-implementations)

## Technologies

### Required Technologies
- **Shadcn UI**: Component library built on Radix UI primitives
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: For type-safe component development

### Essential Files & Structure
- `tailwind.config.js`: Extends Tailwind with custom colors, spacing, etc.
- `components.json`: Shadcn UI configuration
- `src/lib/ui.config.ts`: Design system tokens and values
- `src/app/globals.css`: Global CSS with CSS variables
- `src/components/ui/`: UI component library

## Configuration Steps

### 1. Fix components.json Configuration
The `components.json` file should properly reference the Tailwind configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",  // Must point to tailwind.config.js
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### 2. Ensure Proper Tailwind Configuration
The `tailwind.config.js` file should include:

- Custom colors aligning with our design system
- Extended theme properties
- Content paths for JIT compilation
- Animation configurations
- Proper plugins

Example configuration structure:
```js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "adopt-purple": { /* color values */ },
        "adopt-teal": { /* color values */ },
        // ... other colors
      },
      // ... other theme extensions
    }
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 3. CSS Variables Implementation
Ensure the `globals.css` file correctly implements CSS variables that match the `ui.config.ts` tokens:

```css
:root {
  /* Primary Colors */
  --primary: oklch(0.58 0.22 295); /* #8B5CF6 */
  --primary-light: oklch(0.67 0.18 292); /* #A78BFA */
  /* ... other variables */
}
```

## Design System

All design tokens should be defined in `src/lib/ui.config.ts` and used consistently throughout the application.

### Using Design Tokens

Always import and use tokens from the `ui.config.ts` file:

```typescript
import { ui } from '@/lib/ui.config';

// Using in style prop with modern features
style={{ 
  backgroundColor: `color-mix(in oklch, ${ui.colors.primary.lighter} 90%, transparent)`,
  transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`
}}

// Using with CSS variables
className="text-[color:var(--primary)]"
```

### Design Token Categories

The design system includes these token categories:

1. **Colors**
   - Primary palette (purple)
   - Complementary palette (amber)
   - Accent colors (teal, pink, green)
   - Status colors (success, warning, error, info)
   - Neutral colors (grays)

2. **Typography**
   - Font families
   - Font sizes
   - Font weights
   - Line heights
   - Letter spacing

3. **Spacing**
   - Consistent spacing scale

4. **Animations**
   - Duration
   - Easing functions

5. **Borders & Shadows**
   - Border radii
   - Shadow styles

## Component Implementation

### Component Structure
Follow this structure for all components:

```tsx
'use client'; // if needed

import React from 'react';
import { ui } from '@/lib/ui.config';
import { cn } from '@/lib/utils';
// Import Radix primitives as needed

interface ComponentProps {
  // Type definitions
}

export function Component({ 
  // Props with defaults
}: ComponentProps) {
  // Implementation
  
  return (
    <div
      // Accessible attributes
      // Styling using design tokens
    >
      {/* Component content */}
    </div>
  );
}
```

### Using Radix UI Primitives

Always prefer Radix UI primitives for interactive elements:

```tsx
import * as SelectPrimitive from "@radix-ui/react-select";

// Implement with proper accessibility
const Select = SelectPrimitive.Root;
// ... other parts of the component
```

### Modern Tailwind Features

Leverage these modern Tailwind features:

1. **Color mixing**:
   ```tsx
   style={{ backgroundColor: `color-mix(in oklch, ${ui.colors.primary.DEFAULT} 90%, transparent)` }}
   ```

2. **CSS variables**:
   ```tsx
   className="bg-[color:var(--primary)]"
   ```

3. **Dynamic properties**:
   ```tsx
   className="grid-cols-[repeat(auto-fill,minmax(250px,1fr))]"
   ```

4. **Arbitrary values**:
   ```tsx
   className="top-[117px]"
   ```

## Accessibility Guidelines

### Required ARIA Patterns

For each component type, implement these accessibility patterns:

1. **Buttons and Interactive Elements**
   - Proper `role` attribute
   - `aria-label` for elements without visible text
   - `aria-expanded` for expandable elements
   - Keyboard event handlers

2. **Forms and Inputs**
   - Associated labels
   - `aria-describedby` for error messages
   - Validation states

3. **Dynamic Content**
   - `aria-live` regions for updates
   - `aria-busy` during loading states

4. **Decorative Elements**
   - `aria-hidden="true"` for visual-only elements

### Keyboard Navigation

Ensure all interactive elements are keyboard navigable:
- Focus states are visible
- Tab order is logical
- Keyboard shortcuts have appropriate handlers

## Responsive Design

Follow these mobile-first design principles:

1. **Mobile-First Classes**
   ```tsx
   className="text-sm md:text-base lg:text-lg"
   ```

2. **Container Queries (when needed)**
   ```tsx
   className="@container/sidebar:p-4"
   ```

3. **Responsive Layout Patterns**
   ```tsx
   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
   ```

4. **Conditional Rendering**
   ```tsx
   <div className="hidden md:block">Desktop only content</div>
   <div className="md:hidden">Mobile only content</div>
   ```

## Server-Side Rendering Considerations

Next.js uses React Server Components and hydration, which requires special attention to ensure compatibility between server and client rendering.

### Avoiding Hydration Mismatches

Hydration mismatches occur when the server-rendered HTML doesn't match what the client would render. Common causes include:

1. **Random Values**: Never use `Math.random()`, `Date.now()`, or other non-deterministic values in components that will be server-rendered.

2. **ID Generation**: For generating unique IDs, use React's `useId()` hook instead of random values:

   ```tsx
   // ❌ Don't do this - causes hydration mismatches
   const [id] = React.useState(() => `element-${Math.random().toString(36)}`);
   
   // ✅ Do this instead - stable between server and client
   const id = React.useId();
   const elementId = `element-${id}`;
   ```

3. **Browser-Only Code**: For code that should only run in the browser, use proper initialization:

   ```tsx
   // ❌ Don't do this
   const value = typeof window !== 'undefined' ? window.innerWidth : 0;
   
   // ✅ Do this instead
   const [value, setValue] = React.useState(0);
   React.useEffect(() => {
     setValue(window.innerWidth);
   }, []);
   ```

4. **Locale-Dependent Formatting**: Ensure date and number formatting is consistent between server and client.

### Client Components vs. Server Components

- Use the `'use client'` directive only when necessary (for components that use browser APIs or React hooks)
- Keep as much as possible in Server Components for better performance
- For components that need client interactivity, make the client boundary as small as possible

## Implementation Checklist

When implementing or updating a component, verify:

- [ ] Component imports and uses the design system tokens from `ui.config.ts`
- [ ] Component is built on Radix UI primitives when applicable
- [ ] ARIA attributes are properly implemented
- [ ] Responsive design is mobile-first
- [ ] Modern Tailwind features are utilized
- [ ] Component is keyboard navigable
- [ ] Component has proper TypeScript types
- [ ] Visual states are properly handled (hover, focus, active, disabled)
- [ ] Animation uses design system duration and easing
- [ ] Colors use the design system palette
- [ ] SSR compatibility is maintained (no random values, proper useId usage)

## Implementation Progress

This section tracks our progress in implementing the UI guidelines across components.

### Updated Components

| Component | Status | Last Updated | Notes |
|-----------|--------|--------------|-------|
| Button | ✅ Complete | 2023-07-22 | Updated with all UI guidelines |
| Card | ✅ Complete | 2023-07-22 | Updated with all UI guidelines including subcomponents; Fixed SSR ID generation |
| Input | ✅ Complete | 2023-07-23 | Enhanced with variants, error states, and accessibility features |
| Select | ✅ Complete | 2023-07-23 | Enhanced with variants, form integration wrapper, and accessibility features |
| Checkbox | ✅ Complete | 2023-07-23 | Enhanced with variants, form integration wrapper, and label positioning options |
| Dialog | ⏳ Pending | - | - |
| Tabs | ⏳ Pending | - | - |

### Priority Queue

1. ✅ Button - Completed
2. ✅ Card - Completed
3. ✅ Input - Completed
4. ✅ Select - Completed
5. ✅ Checkbox - Completed
6. ⏱️ Navigation components - Medium priority
7. ⏱️ Modal components (Dialog, Alert) - Medium priority

## Example Implementations

### Button Component

The Button component has been updated to follow all guidelines. Key implementation details:

```tsx
/**
 * Button Component
 * 
 * An accessible, customizable button component built on Radix UI primitives.
 * Follows the design system defined in ui.config.ts and implements WCAG accessibility standards.
 */

'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ui } from '@/lib/ui.config';
import { Spinner } from "./spinner";

/**
 * Button variants and styling using class-variance-authority
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)]",
        outline: "border border-input bg-background hover:bg-[color:var(--primary-lighter)]/20 hover:text-[color:var(--primary)]",
        // ... other variants
      },
      // ... other variant types
    }
  }
);

/**
 * Button component implementation
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ /* props */ }, ref) => {
    // Implementation details...
    
    return (
      <Comp
        className={/* classes */}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        style={{
          transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`
        }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Button content */}
      </Comp>
    );
  }
);
```

### Card Component

The Card component has been updated to follow all guidelines. Key implementation details:

```tsx
/**
 * Card Component
 * 
 * A versatile card component for containing related content with 
 * various subcomponents (header, title, description, content, footer).
 * Follows the design system defined in ui.config.ts.
 */

'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { ui } from '@/lib/ui.config';

/**
 * Card component props
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to invert the card colors for dark backgrounds */
  inverted?: boolean;
}

/**
 * Main Card container component
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, inverted = false, children, ...props }, ref) => {
    // Generate a stable ID using React's useId hook
    const id = React.useId();
    const cardId = `card-${id}`;
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)]",
          "shadow-sm transition-all duration-200",
          inverted && "bg-[color:var(--primary)] text-white border-transparent",
          className
        )}
        style={{
          borderRadius: ui.radius.lg,
          boxShadow: ui.shadows.DEFAULT,
          transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`
        }}
        role="group"
        id={cardId}
        {...props}
      >
        {children}
      </div>
    );
  }
);
```

### Input Component

The Input component has been updated to follow all guidelines. Key implementation details:

```tsx
/**
 * Input Component
 * 
 * A flexible, accessible input component supporting various states and configurations.
 * Follows the design system defined in ui.config.ts and implements WCAG accessibility standards.
 */

'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ui } from '@/lib/ui.config';

/**
 * Input variants and styling
 */
const inputVariants = cva(
  "flex w-full rounded-md border bg-background ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input text-foreground focus-visible:ring-ring",
        error: "border-[color:var(--error)] text-[color:var(--error)] placeholder:text-[color:var(--error)]/60 focus-visible:ring-[color:var(--error)]",
        success: "border-[color:var(--success)] text-foreground focus-visible:ring-[color:var(--success)]",
      },
      inputSize: {
        default: "h-10 px-3 py-2 text-sm",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
      withIcon: {
        true: "pl-10", // Space for icon
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      withIcon: false,
    },
  }
);

/**
 * Input component with enhanced props
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof inputVariants>, 'inputSize'> {
  /** Error message to display */
  error?: string;
  /** Success message or validation state */
  success?: boolean | string;
  /** Help text to provide additional context */
  helpText?: string;
  /** Icon to display inside the input */
  icon?: React.ReactNode;
  /** Where to position the icon */
  iconPosition?: 'left' | 'right';
  /** Container className for wrapping the input */
  containerClassName?: string;
  /** Input size variant - renamed to avoid conflict with HTML size attribute */
  inputSize?: 'default' | 'sm' | 'lg';
}

/**
 * Input component implementation with accessibility features
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text", 
    error, 
    success, 
    helpText,
    variant,
    inputSize,
    icon,
    iconPosition = 'left',
    withIcon,
    containerClassName,
    id,
    'aria-describedby': ariaDescribedby,
    ...props 
  }, ref) => {
    // Generate unique IDs for accessibility
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helpTextId = `${inputId}-help`;
    
    // Handle state variants
    const computedVariant = error ? "error" : success ? "success" : variant;
    
    return (
      <div className={cn("relative w-full", containerClassName)}>
        {/* Input with icon */}
        <div className="relative">
          {/* Icon positioning */}
          {icon && iconPosition === 'left' && (
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ 
                variant: computedVariant, 
                inputSize, 
                withIcon: !!icon && iconPosition === 'left' 
              }),
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={/* computed aria-describedby */}
            style={{
              transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`,
              borderRadius: ui.radius.md,
            }}
            {...props}
          />
          
          {/* Right-positioned icon */}
          {/* ... */}
        </div>
        
        {/* Error and help text */}
        {/* ... */}
      </div>
    );
  }
);
```

### Select Component

The Select component has been updated to follow all guidelines. Key implementation details:

```tsx
/**
 * Select Component
 * 
 * A customizable, accessible dropdown select component built on Radix UI primitives.
 * Follows the design system defined in ui.config.ts and implements WCAG accessibility standards.
 */

"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { ui } from '@/lib/ui.config'

/**
 * Trigger variants using class-variance-authority
 */
const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-md border bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      variant: {
        default: "border-input focus:ring-ring text-foreground",
        error: "border-[color:var(--error)] focus:ring-[color:var(--error)] text-[color:var(--error)]",
        success: "border-[color:var(--success)] focus:ring-[color:var(--success)] text-foreground",
      },
      size: {
        default: "h-10 px-3 py-2 text-sm",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: true,
    }
  }
)

/**
 * FormSelect component - Enhanced Select with integrated label, error handling and accessibility
 * 
 * @example
 * <FormSelect 
 *   label="Pet Type" 
 *   placeholder="Select a pet type"
 *   error="Please select a pet type"
 *   onValueChange={(value) => console.log(value)}
 * >
 *   <SelectItem value="dog">Dog</SelectItem>
 *   <SelectItem value="cat">Cat</SelectItem>
 *   <SelectItem value="bird">Bird</SelectItem>
 * </FormSelect>
 */
const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ 
    label,
    error,
    success,
    helpText,
    id,
    size = "default",
    fullWidth = true,
    children,
    placeholder,
    containerClassName,
    onValueChange,
    defaultValue,
    value,
    ...props
  }, ref) => {
    // Generate stable IDs for SSR compatibility
    const selectId = id || React.useId();
    const errorId = `${selectId}-error`;
    const helpTextId = `${selectId}-help`;
    const labelId = `${selectId}-label`;

    // Determine variant based on status
    const variant = error ? "error" : success ? "success" : "default";
    
    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <label 
            htmlFor={selectId} 
            id={labelId} 
            className={cn(
              "text-sm font-medium",
              error && "text-[color:var(--error)]"
            )}
            style={{
              fontSize: ui.typography.fontSize.sm,
              fontWeight: ui.typography.fontWeight.medium,
            }}
          >
            {label}
          </label>
        )}
        
        <Select
          defaultValue={defaultValue}
          value={value}
          onValueChange={onValueChange}
          {...props}
        >
          <SelectTrigger 
            id={selectId}
            ref={ref}
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            aria-describedby={describedBy || undefined}
            aria-invalid={!!error}
            aria-labelledby={label ? labelId : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          
          <SelectContent>
            {children}
          </SelectContent>
        </Select>
        
        {/* Error message */}
        {error && (
          <p 
            id={errorId} 
            className="text-xs text-[color:var(--error)]" 
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {/* Success and help text */}
        {/* ... */}
      </div>
    );
  }
);
```

### Checkbox Component

The Checkbox component has been updated to follow all guidelines. Key implementation details:

```tsx
/**
 * Checkbox Component
 * 
 * An accessible, customizable checkbox component built on Radix UI primitives.
 * Follows the design system defined in ui.config.ts and implements WCAG accessibility standards.
 */

"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ui } from '@/lib/ui.config';

/**
 * Checkbox variants using class-variance-authority
 */
const checkboxVariants = cva(
  "peer shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-ring",
        error: "border-[color:var(--error)] focus-visible:ring-[color:var(--error)] data-[state=checked]:bg-[color:var(--error)] data-[state=checked]:text-white",
        success: "border-[color:var(--success)] focus-visible:ring-[color:var(--success)] data-[state=checked]:bg-[color:var(--success)] data-[state=checked]:text-white",
      },
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    }
  }
);

/**
 * FormCheckbox component - Enhanced Checkbox with integrated label, error handling and accessibility
 * 
 * @example
 * <FormCheckbox 
 *   label="I agree to the terms and conditions" 
 *   error="You must agree to the terms"
 *   onCheckedChange={(checked) => console.log(checked)}
 *   required
 * />
 */
const FormCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  FormCheckboxProps
>(({ 
  label, 
  error, 
  success, 
  helpText, 
  id, 
  size = "default", 
  containerClassName,
  labelPosition = "right",
  required,
  className,
  ...props 
}, ref) => {
  // Generate stable IDs for SSR compatibility
  const checkboxId = id || React.useId();
  const errorId = `${checkboxId}-error`;
  const helpTextId = `${checkboxId}-help`;

  // Determine variant based on status
  const variant = error ? "error" : success ? "success" : "default";
  
  return (
    <div className={cn("w-full", containerClassName)}>
      <div className={cn(
        "flex items-center gap-2",
        labelPosition === "left" && "flex-row-reverse justify-end",
      )}>
        <Checkbox
          id={checkboxId}
          ref={ref}
          variant={variant}
          size={size}
          aria-describedby={describedBy || undefined}
          aria-invalid={!!error}
          className={className}
          {...props}
        />
        
        <label 
          htmlFor={checkboxId} 
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error && "text-[color:var(--error)]"
          )}
          style={{
            fontSize: ui.typography.fontSize.sm,
            fontWeight: ui.typography.fontWeight.medium,
          }}
        >
          {label}
          {required && (
            <span className="text-[color:var(--error)] ml-1">*</span>
          )}
        </label>
      </div>
      
      {/* Error and help text */}
      {/* ... */}
    </div>
  );
});
```

#### Implementation Notes:

1. **Component Structure**:
   - Added proper JSDoc documentation
   - Used 'use client' directive
   - Imported ui.config.ts tokens
   - Used class-variance-authority (cva) for variants
   - Maintained compatibility with Radix UI primitives

2. **Accessibility Features**:
   - Added proper label association
   - Added ARIA attributes for error and help text
   - Used React.useId() for stable ID generation
   - Created live regions for error messages

3. **Enhanced Functionality**:
   - Added support for error and success states
   - Added flexible label positioning (left/right)
   - Added size variants (default, sm, lg)
   - Added required field indicator
   - Added help text support

4. **Modern Styling**:
   - Used CSS variables for colors
   - Applied ui.config.ts tokens for styling
   - Added transition effects
   - Enhanced focus states

---

This UI guidelines document should be reviewed and updated as the design system evolves. Following these guidelines ensures a consistent, accessible, and maintainable user interface across the AdoptMe application. 