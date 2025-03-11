import * as React from "react"

import { cn } from "@/lib/utils"

// Base Card component with modern styling and micro-interactions
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground",
        "transition-all duration-200 ease-in-out",
        "shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]",
        "hover:shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)]",
        "focus-within:shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)]",
        "focus-within:border-primary/20",
        "overflow-hidden",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

// Card Header with improved spacing and typography
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        "border-b border-border/10",
        "bg-gradient-to-b from-card/50 to-card",
        className
      )}
      {...props}
    />
  ),
)
CardHeader.displayName = "CardHeader"

// Card Title with enhanced typography and mobile responsiveness
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl sm:text-2xl font-semibold leading-tight tracking-tight",
        "text-foreground/90",
        className
      )}
      {...props}
    />
  ),
)
CardTitle.displayName = "CardTitle"

// Card Description with better readability
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    />
  ),
)
CardDescription.displayName = "CardDescription"

// Card Content with responsive padding
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 sm:py-5 text-foreground/80",
        "last:pb-6",
        className
      )}
      {...props}
    />
  ),
)
CardContent.displayName = "CardContent"

// Card Footer with improved alignment and spacing
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between px-6 py-4",
        "border-t border-border/10 bg-muted/5",
        className
      )}
      {...props}
    />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

