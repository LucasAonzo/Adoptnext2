import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  /**
   * The size of the spinner
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  
  /**
   * The color of the spinner
   * @default "primary"
   */
  color?: "primary" | "secondary" | "muted" | "white" | "black";
  
  /**
   * The thickness of the spinner
   * @default "regular"
   */
  thickness?: "thin" | "regular" | "thick";
  
  /**
   * The type of spinner animation
   * @default "spin"
   */
  animation?: "spin" | "pulse";
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}

/**
 * Spinner - A component for displaying loading state
 */
export function Spinner({
  size = "md",
  color = "primary",
  thickness = "regular",
  animation = "spin",
  className,
}: SpinnerProps) {
  // Size classes
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };
  
  // Color classes
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
    white: "text-white",
    black: "text-black",
  };
  
  // Thickness classes
  const thicknessClasses = {
    thin: "stroke-1",
    regular: "stroke-2",
    thick: "stroke-3",
  };
  
  // Animation classes
  const animationClasses = {
    spin: "animate-spin",
    pulse: "animate-pulse",
  };
  
  return (
    <Loader2 
      className={cn(
        animationClasses[animation],
        sizeClasses[size],
        colorClasses[color],
        thicknessClasses[thickness],
        className
      )} 
    />
  );
}

/**
 * SpinnerOverlay - A component for displaying a full-page spinner overlay
 */
export function SpinnerOverlay({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50",
      className
    )}>
      <Spinner size="xl" />
      {message && (
        <p className="mt-4 text-foreground font-medium animate-fade-in">{message}</p>
      )}
    </div>
  );
} 