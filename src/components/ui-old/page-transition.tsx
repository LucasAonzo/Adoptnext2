'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  /**
   * The content to be animated
   */
  children: React.ReactNode;
  
  /**
   * The type of animation to apply
   * @default "fade-up"
   */
  type?: "fade" | "fade-up" | "fade-down" | "slide-left" | "slide-right" | "scale";
  
  /**
   * The duration of the animation
   * @default "default"
   */
  duration?: "fast" | "default" | "slow";
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}

/**
 * PageTransition - A component for adding page transition animations
 */
export function PageTransition({
  children,
  type = "fade-up",
  duration = "default",
  className,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  
  // Reset animation state on page change
  useEffect(() => {
    setIsVisible(false);
    
    // Small delay to ensure animation reset
    const resetTimer = setTimeout(() => {
      // Start animation
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(resetTimer);
  }, [pathname]);
  
  // Animation classes mapped to types
  const animationInitialClasses = {
    fade: "opacity-0",
    "fade-up": "opacity-0 translate-y-4",
    "fade-down": "opacity-0 -translate-y-4",
    "slide-left": "opacity-0 translate-x-16",
    "slide-right": "opacity-0 -translate-x-16",
    scale: "opacity-0 scale-95",
  };
  
  // Animated state classes (all animations end up at same visual state)
  const animatedClasses = "opacity-100 translate-y-0 translate-x-0 scale-100";
  
  // Duration classes
  const durationClasses = {
    fast: "duration-fast",
    default: "duration-default",
    slow: "duration-slow",
  };
  
  return (
    <div
      className={cn(
        "transition-all will-change-transform",
        animationInitialClasses[type],
        durationClasses[duration],
        isVisible && animatedClasses,
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * PageTransitionProvider - A component that wraps the app layout to provide page transitions
 */
export function PageTransitionProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PageTransition className={className}>
      {children}
    </PageTransition>
  );
} 