/**
 * Button Component
 * 
 * An accessible, customizable button component built on Radix UI primitives.
 * Uses Tailwind CSS for styling with a consistent design system.
 */

'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

/**
 * Button props interface extending HTMLButtonElement props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual variant */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "subtle" | "success" | "warning" | "info";
  
  /** Button size variant */
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  
  /** Animation effect */
  animation?: "none" | "pulse" | "bounce";
  
  /** Whether to show focus ring */
  withRing?: boolean;
  
  /** Whether to add shadow */
  withShadow?: boolean;
  
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
    variant = "default", 
    size = "default", 
    animation = "none",
    withRing = false,
    withShadow = false,
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
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          
          // Variant styles
          variant === "default" && "bg-primary text-white hover:bg-primary-dark",
          variant === "destructive" && "bg-error text-white hover:bg-error/90",
          variant === "outline" && "border border-input bg-background hover:bg-primary-lighter/20 hover:text-primary",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "ghost" && "hover:bg-primary-lighter/20 hover:text-primary",
          variant === "link" && "underline-offset-4 hover:underline text-primary p-0 h-auto",
          variant === "subtle" && "bg-primary/10 text-primary hover:bg-primary/20",
          variant === "success" && "bg-success text-white hover:bg-success/90",
          variant === "warning" && "bg-warning text-black hover:bg-warning/90",
          variant === "info" && "bg-info text-white hover:bg-info/90",
          
          // Size styles
          size === "default" && "h-10 py-2 px-4",
          size === "sm" && "h-9 px-3 rounded-md text-xs",
          size === "lg" && "h-11 px-8 rounded-md",
          size === "xl" && "h-12 px-10 rounded-md text-lg",
          size === "icon" && "h-10 w-10",
          
          // Animation styles
          animation === "pulse" && "animate-pulse",
          animation === "bounce" && "animate-bounce",
          
          // Extra features
          withRing && "focus:ring-2 focus:ring-primary focus:ring-offset-2",
          withShadow && "shadow-md hover:shadow-lg",
          
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
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

export { Button }
