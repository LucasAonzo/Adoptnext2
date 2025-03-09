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
 * Base Select Root component
 */
const Select = SelectPrimitive.Root

/**
 * Select Group component for grouping related options
 */
const SelectGroup = SelectPrimitive.Group

/**
 * Select Value component for displaying the selected value
 */
const SelectValue = SelectPrimitive.Value

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
 * Select Trigger component for opening the dropdown
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & VariantProps<typeof selectTriggerVariants>
>(({ className, children, variant, size, fullWidth, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size, fullWidth }), className)}
    style={{
      transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`,
      borderRadius: ui.radius.md,
    }}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * Select Scroll Up Button component for scrolling options list
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

/**
 * Select Scroll Down Button component for scrolling options list
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

/**
 * Select Content component for displaying the dropdown list
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      style={{
        borderRadius: ui.radius.md,
        boxShadow: ui.shadows.lg,
        borderColor: 'var(--border)',
      }}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * Select Label component for labeling groups of options
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    style={{
      fontWeight: ui.typography.fontWeight.semibold,
      fontSize: ui.typography.fontSize.sm,
    }}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * Select Item component for individual dropdown options
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    style={{
      fontSize: ui.typography.fontSize.sm,
      transition: `background-color ${ui.animation.duration.fast} ${ui.animation.easing.default}`,
    }}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * Select Separator component for visual separation in the dropdown
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    style={{
      backgroundColor: 'var(--muted)',
    }}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

/**
 * FormSelect Props interface
 */
interface FormSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  /** Label text for the select */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Success message or validation state */
  success?: boolean | string;
  /** Help text to provide additional context */
  helpText?: string;
  /** ID for the select element - will be generated if not provided */
  id?: string;
  /** Size variant */
  size?: "default" | "sm" | "lg";
  /** Whether the select should take full width */
  fullWidth?: boolean;
  /** Children should be SelectItem components */
  children: React.ReactNode;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Additional class name for the container */
  containerClassName?: string;
  /** Callback when selection changes */
  onValueChange?: (value: string) => void;
}

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
    
    // Determine the describedby attribute
    const describedBy = cn(
      error ? errorId : "",
      !error && helpText ? helpTextId : ""
    );

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
        
        {/* Success message */}
        {success && typeof success === "string" && (
          <p 
            className="text-xs text-[color:var(--success)]" 
            aria-live="polite"
          >
            {success}
          </p>
        )}
        
        {/* Help text */}
        {helpText && !error && (
          <p 
            id={helpTextId} 
            className="text-xs text-muted-foreground"
            style={{
              fontSize: ui.typography.fontSize.xs,
            }}
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  FormSelect,
  selectTriggerVariants,
}
