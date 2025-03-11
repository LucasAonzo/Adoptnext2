import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adopt-purple-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-adopt-purple-600 text-white hover:bg-adopt-purple-700 shadow-sm hover:shadow-purple",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-adopt-purple-200 bg-white hover:bg-adopt-purple-50 hover:border-adopt-purple-300 text-adopt-purple-600",
        secondary: "bg-adopt-teal-500 text-white hover:bg-adopt-teal-600 shadow-sm",
        ghost: "hover:bg-adopt-purple-50 text-adopt-gray-600 hover:text-adopt-purple-600",
        link: "text-adopt-purple-600 underline-offset-4 hover:underline",
        primary: "bg-adopt-purple-600 text-white hover:bg-adopt-purple-700 shadow-sm hover:shadow-purple",
        accent: "bg-adopt-amber-500 text-white hover:bg-adopt-amber-600 shadow-sm",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 py-2",
        lg: "h-12 rounded-md px-8 py-3 text-base",
        icon: "h-10 w-10",
        pill: "h-10 px-6 py-2.5 rounded-full",
        "lg-pill": "h-12 px-8 py-3 rounded-full text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp 
        className={cn(className, buttonVariants({ variant, size }))} 
        ref={ref} 
        {...props} 
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

