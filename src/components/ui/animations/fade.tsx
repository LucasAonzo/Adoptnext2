'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FadeProps {
  /**
   * The content to be animated
   */
  children: React.ReactNode;
  
  /**
   * Whether the content should be shown or hidden
   * @default true
   */
  show?: boolean;
  
  /**
   * The duration of the animation
   * @default "default"
   */
  duration?: "fast" | "default" | "slow" | "very-slow";
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}

/**
 * Fade - A component for smoothly fading content in and out
 */
export function Fade({
  children,
  show = true,
  duration = "default",
  className,
}: FadeProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      // Keep element in DOM during fade out animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, getDurationInMs(duration));
      
      return () => clearTimeout(timer);
    }
  }, [show, duration]);
  
  if (!isVisible && !show) return null;
  
  const durationClass = {
    fast: "duration-fast",
    default: "duration-default",
    slow: "duration-slow",
    "very-slow": "duration-very-slow",
  };
  
  return (
    <div
      className={cn(
        "transition-opacity",
        durationClass[duration],
        show ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

// Helper function to get duration in milliseconds for timeouts
function getDurationInMs(duration: "fast" | "default" | "slow" | "very-slow"): number {
  switch (duration) {
    case "fast": return 100;
    case "default": return 200;
    case "slow": return 300;
    case "very-slow": return 500;
    default: return 200;
  }
} 