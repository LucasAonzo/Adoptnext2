/**
 * Checkbox Component
 * 
 * An accessible, customizable checkbox component built on Radix UI primitives.
 * Uses Tailwind CSS for styling with a consistent design system.
 */

"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Base Checkbox component props
 */
export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Visual variant */
  variant?: "default" | "error" | "success";
  
  /** Size variant */
  size?: "default" | "sm" | "lg";
}

/**
 * Base Checkbox component built on Radix UI primitive
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant = "default", size = "default", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles
      "peer shrink-0 rounded-sm border ring-offset-background transition-all duration-100 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      
      // Variant styles
      variant === "default" && "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-ring",
      variant === "error" && "border-error focus-visible:ring-error data-[state=checked]:bg-error data-[state=checked]:text-white",
      variant === "success" && "border-success focus-visible:ring-success data-[state=checked]:bg-success data-[state=checked]:text-white",
      
      // Size styles
      size === "default" && "h-4 w-4",
      size === "sm" && "h-3 w-3",
      size === "lg" && "h-5 w-5",
      
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className="flex items-center justify-center text-current"
    >
      <Check className={cn(
        size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
      )} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

/**
 * FormCheckbox Props interface
 */
interface FormCheckboxProps extends Omit<CheckboxProps, 'id'> {
  /** Label text for the checkbox */
  label: string;
  
  /** Error message to display */
  error?: string;
  
  /** Success message or validation state */
  success?: boolean | string;
  
  /** Help text to provide additional context */
  helpText?: string;
  
  /** ID for the checkbox - will be generated if not provided */
  id?: string;
  
  /** Additional class name for the container */
  containerClassName?: string;
  
  /** Position of the label */
  labelPosition?: "right" | "left";
  
  /** Whether the checkbox is required */
  required?: boolean;
}

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
  
  // Determine the describedby attribute
  const describedBy = cn(
    error ? errorId : "",
    !error && helpText ? helpTextId : ""
  );

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
            error && "text-error"
          )}
        >
          {label}
          {required && (
            <span className="text-error ml-1">*</span>
          )}
        </label>
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
      {success && typeof success === "string" && (
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
  );
});

FormCheckbox.displayName = "FormCheckbox";

export { Checkbox, FormCheckbox }; 