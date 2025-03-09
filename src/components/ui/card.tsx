/**
 * Card Component
 * 
 * A versatile card component for containing related content with 
 * various subcomponents (header, title, description, content, footer).
 * Follows the design system defined in ui.config.ts.
 */

'use client';

import * as React from "react"

import { cn } from "@/lib/utils"
import { ui } from '@/lib/ui.config'

/**
 * Card component props
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to invert the card colors for dark backgrounds */
  inverted?: boolean;
}

/**
 * Main Card container component
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content goes here</CardContent>
 *   <CardFooter>Footer content</CardFooter>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, inverted = false, children, ...props }, ref) => {
    // Generate a stable ID using React's useId hook instead of Math.random()
    // This ensures consistent IDs between server and client rendering
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
Card.displayName = "Card";

/**
 * Card header component - contains title and description
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    style={{
      padding: ui.spacing[6]
    }}
    role="presentation"
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Card title component - the heading for the card
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
>(({ className, as: Comp = 'h3', ...props }, ref) => {
  // Get parent card ID if available - using optional chaining for safety
  const cardId = props.id || ((props as any).parentElement?.parentElement?.id ? `${(props as any).parentElement?.parentElement?.id}-title` : undefined);
  
  return (
    <Comp
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-[color:var(--foreground)]",
        className
      )}
      style={{
        fontSize: ui.typography.fontSize.lg,
        fontWeight: ui.typography.fontWeight.semibold,
        lineHeight: ui.typography.lineHeight.none
      }}
      id={cardId}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

/**
 * Card description component - supporting text for the card
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-[color:var(--muted-foreground)]",
      className
    )}
    style={{
      fontSize: ui.typography.fontSize.sm
    }}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Card content component - the main content area of the card
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)}
    style={{
      padding: ui.spacing[6],
      paddingTop: 0
    }}
    {...props} 
  />
));
CardContent.displayName = "CardContent";

/**
 * Card footer component - for actions or supplementary content
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0",
      className
    )}
    style={{
      padding: ui.spacing[6],
      paddingTop: 0
    }}
    role="group"
    aria-label="Card actions"
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
