/**
 * Badge Component
 * 
 * A small tag-like component for status indicators, labels, or categories.
 * Uses Tailwind CSS for styling with a consistent design system.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the badge
   */
  variant?: "default" | "secondary" | "destructive" | "outline";
}

/**
 * Badge component for displaying short status text, labels, or categories
 */
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        // Base styles
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        
        // Variant styles
        variant === "default" && 
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        variant === "secondary" && 
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "destructive" && 
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        variant === "outline" && 
          "border border-input text-foreground",
          
        className
      )} 
      {...props} 
    />
  );
}

// Export the Badge component but not the badgeVariants function
export { Badge }; 