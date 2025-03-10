import React from "react";
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The type of animation to apply
   * @default "shimmer"
   */
  animation?: "pulse" | "shimmer" | "wave" | "none";
  
  /**
   * The variant of the skeleton
   * @default "default"
   */
  variant?: "default" | "circular" | "text" | "rectangular" | "rounded";
  
  /**
   * The width of the skeleton
   * If not provided, the skeleton will fill its container
   */
  width?: string | number;
  
  /**
   * The height of the skeleton
   * If not provided, the skeleton will have a default height based on the variant
   */
  height?: string | number;
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}

/**
 * Skeleton - A component for displaying loading state placeholders
 */
export function Skeleton({
  animation = "shimmer",
  variant = "default",
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  // Animation classes
  const animationClasses = {
    shimmer: "animate-shimmer",
    pulse: "animate-pulse",
    wave: "overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
    none: "",
  };
  
  // Variant classes
  const variantClasses = {
    default: "rounded-md",
    circular: "rounded-full",
    text: "rounded-md h-4",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };
  
  // Default heights based on variant
  const defaultHeight = {
    default: "h-4",
    circular: "h-12 w-12", // Square dimensions for circular variant
    text: "h-4",
    rectangular: "h-16",
    rounded: "h-8",
  };
  
  return (
    <div
      className={cn(
        "relative bg-muted/60",
        animationClasses[animation],
        variantClasses[variant],
        variant === "circular" && !width && !height ? "h-12 w-12" : "",
        !height && defaultHeight[variant],
        className
      )}
      style={{
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
      }}
      {...props}
    />
  );
}

/**
 * SkeletonText - A component for displaying text skeleton placeholders
 */
export function SkeletonText({
  lines = 3,
  lastLineWidth = 70,
  animation = "shimmer",
  className,
  ...props
}: {
  lines?: number;
  lastLineWidth?: number;
  animation?: "pulse" | "shimmer" | "wave" | "none";
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          animation={animation}
          variant="text"
          className={i === lines - 1 ? `w-[${lastLineWidth}%]` : "w-full"}
        />
      ))}
    </div>
  );
}
