/**
 * Button Component
 * 
 * An accessible, customizable button component built on Radix UI primitives.
 * Follows the design system defined in ui.config.ts and implements WCAG accessibility standards.
 */

'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ui } from '@/lib/ui.config'
import { Spinner } from "./spinner"

/**
 * Button variants and styling using class-variance-authority
 * 
 * Uses design system tokens from ui.config.ts for consistent styling
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)]",
        destructive: "bg-[color:var(--error)] text-white hover:bg-[color:var(--error)]/90",
        outline: "border border-input bg-background hover:bg-[color:var(--primary-lighter)]/20 hover:text-[color:var(--primary)]",
        secondary: "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] hover:bg-[color:var(--secondary)]/80",
        ghost: "hover:bg-[color:var(--primary-lighter)]/20 hover:text-[color:var(--primary)]",
        link: "underline-offset-4 hover:underline text-[color:var(--primary)] p-0 h-auto",
        subtle: "bg-[color:var(--primary)]/10 text-[color:var(--primary)] hover:bg-[color:var(--primary)]/20",
        success: "bg-[color:var(--success)] text-white hover:bg-[color:var(--success)]/90",
        warning: "bg-[color:var(--warning)] text-black hover:bg-[color:var(--warning)]/90",
        info: "bg-[color:var(--info)] text-white hover:bg-[color:var(--info)]/90",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md text-xs",
        lg: "h-11 px-8 rounded-md",
        xl: "h-12 px-10 rounded-md text-lg",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      },
      withRing: {
        true: "focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2",
        false: "",
      },
      withShadow: {
        true: "shadow-md hover:shadow-lg",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      withRing: false,
      withShadow: false,
    },
  }
)

/**
 * Button props interface extending HTMLButtonElement props
 * and variant props from cva
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Use the button as a child slot (Radix UI) */
  asChild?: boolean;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Text to display while loading */
  loadingText?: string;
  /** Icon to display before the button text */
  leftIcon?: React.ReactNode;
  /** Icon to display after the button text */
  rightIcon?: React.ReactNode;
}

/**
 * Button component with various variants and states
 * 
 * Features:
 * - Multiple variants (default, outline, ghost, etc.)
 * - Loading state with spinner
 * - Left and right icon support
 * - Size options (sm, default, lg, xl)
 * - Animation options
 * - Accessibility attributes
 * - Keyboard navigation
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    withRing,
    withShadow,
    asChild = false, 
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    onClick,
    onKeyDown,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || isLoading;
    
    // Enhance keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Trigger click on Space key for div buttons
      if (e.key === ' ' && asChild) {
        e.preventDefault();
        e.currentTarget.click();
      }
      
      if (onKeyDown) {
        onKeyDown(e);
      }
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ 
          variant, 
          size, 
          animation,
          withRing,
          withShadow,
          className 
        }))}
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
        {isLoading ? (
          <>
            <Spinner 
              size="sm" 
              color="white" 
              className="mr-2" 
              aria-hidden="true"
            />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <div className="flex items-center">
            {leftIcon && (
              <span className="mr-2" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            <span>{children}</span>
            {rightIcon && (
              <span className="ml-2" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
