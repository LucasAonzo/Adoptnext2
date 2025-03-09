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
 * Base Checkbox component built on Radix UI primitive
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>
>(({ className, variant, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, size }), className)}
    style={{
      borderRadius: ui.radius.sm,
      transition: `all ${ui.animation.duration.fast} ${ui.animation.easing.default}`,
    }}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
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
interface FormCheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'id'> {
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
  /** Size variant */
  size?: "default" | "sm" | "lg";
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
      {success && typeof success === "string" && (
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
          style={{
            fontSize: ui.typography.fontSize.xs,
          }}
        >
          {helpText}
        </p>
      )}
    </div>
  );
});

FormCheckbox.displayName = "FormCheckbox";

export { Checkbox, FormCheckbox, checkboxVariants }; 