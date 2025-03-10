/**
 * Input Component
 * 
 * A flexible, accessible input component supporting various states and configurations.
 * Uses Tailwind CSS for styling with a consistent design system.
 */

'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Input component props extending HTML input attributes
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visual variant */
  variant?: 'default' | 'error' | 'success';
  
  /** Input size variant - renamed to avoid conflict with HTML size attribute */
  inputSize?: 'default' | 'sm' | 'lg';
  
  /** Whether input has an icon */
  withIcon?: boolean;
  
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
}

/**
 * Input component with accessibility features
 * 
 * @example
 * <Input 
 *   placeholder="Email address" 
 *   type="email" 
 *   icon={<Mail />} 
 *   error="Please enter a valid email"
 * />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text", 
    error, 
    success, 
    helpText,
    variant = "default",
    inputSize = "default",
    icon,
    iconPosition = 'left',
    withIcon = false,
    containerClassName,
    id,
    'aria-describedby': ariaDescribedby,
    ...props 
  }, ref) => {
    // Generate unique IDs for accessibility
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helpTextId = `${inputId}-help`;
    
    // Determine variant based on error/success props
    const computedVariant = error ? "error" : success ? "success" : variant;
    
    // Calculate aria-describedby based on error/help text
    const computedAriaDescribedby = cn(
      error ? errorId : "",
      helpText ? helpTextId : "",
      ariaDescribedby
    );
    
    // Determine if we have an icon
    const hasIcon = !!icon;
    
    return (
      <div className={cn("relative w-full", containerClassName)}>
        {/* Input with icon positioning */}
        <div className="relative">
          {hasIcon && iconPosition === 'left' && (
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
              // Base styles
              "flex w-full rounded-md border bg-background ring-offset-background transition-colors duration-200 ease-in-out",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              
              // Variant styles
              computedVariant === "default" && "border-input text-foreground focus-visible:ring-ring",
              computedVariant === "error" && "border-error text-error placeholder:text-error/60 focus-visible:ring-error",
              computedVariant === "success" && "border-success text-foreground focus-visible:ring-success",
              
              // Size styles
              inputSize === "default" && "h-10 px-3 py-2 text-sm",
              inputSize === "sm" && "h-8 px-2 py-1 text-xs",
              inputSize === "lg" && "h-12 px-4 py-3 text-base",
              
              // Icon padding
              hasIcon && iconPosition === 'left' && "pl-10",
              
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={computedAriaDescribedby || undefined}
            {...props}
          />
          
          {hasIcon && iconPosition === 'right' && (
            <div 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <p 
            id={errorId} 
            className="mt-1.5 text-xs text-error" 
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {/* Success message */}
        {success && typeof success === 'string' && (
          <p 
            className="mt-1.5 text-xs text-success" 
            aria-live="polite"
          >
            {success}
          </p>
        )}
        
        {/* Help text */}
        {helpText && !error && (
          <p 
            id={helpTextId} 
            className="mt-1.5 text-xs text-muted-foreground"
          >
            {helpText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
