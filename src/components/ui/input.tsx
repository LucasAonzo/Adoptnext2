/**
 * Input Component
 * 
 * A flexible, accessible input component supporting various states and configurations.
 * Follows the design system defined in ui.config.ts and implements WCAG accessibility standards.
 */

'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ui } from '@/lib/ui.config'

/**
 * Input variants and styling using class-variance-authority
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
)

/**
 * Input component props extending HTML input attributes and variants
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
 * Input component with accessibility features and design token integration
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
              inputVariants({ 
                variant: computedVariant, 
                inputSize, 
                withIcon: hasIcon && iconPosition === 'left' 
              }),
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={computedAriaDescribedby || undefined}
            style={{
              transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`,
              borderRadius: ui.radius.md,
            }}
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
            className="mt-1.5 text-xs text-[color:var(--error)]" 
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {/* Success message */}
        {success && typeof success === 'string' && (
          <p 
            className="mt-1.5 text-xs text-[color:var(--success)]" 
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

export { Input, inputVariants }
