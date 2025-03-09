'use client';

import React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * The type of animation to apply
 */
type AnimationType = 
  | "fade" 
  | "slide-up" 
  | "slide-down" 
  | "slide-left" 
  | "slide-right" 
  | "scale" 
  | "rotate"
  | "fade-scale";

interface MotionProps {
  /**
   * The content to be animated
   */
  children: React.ReactNode;
  
  /**
   * The type of animation to apply
   */
  type: AnimationType;
  
  /**
   * The delay before the animation starts (in milliseconds)
   * @default 0
   */
  delay?: number;
  
  /**
   * The duration of the animation
   * @default "default"
   */
  duration?: "fast" | "default" | "slow" | "very-slow";
  
  /**
   * Whether the animation should play
   * @default true
   */
  animate?: boolean;
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}

/**
 * Motion - A component for applying various animations to content
 */
export function Motion({
  children,
  type,
  delay = 0,
  duration = "default",
  animate = true,
  className,
}: MotionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsAnimating(true), delay);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [animate, delay]);
  
  const animationClass = {
    fade: "opacity-0 transition-opacity",
    "slide-up": "opacity-0 translate-y-4 transition-all",
    "slide-down": "opacity-0 -translate-y-4 transition-all",
    "slide-left": "opacity-0 translate-x-4 transition-all",
    "slide-right": "opacity-0 -translate-x-4 transition-all",
    scale: "opacity-0 scale-95 transition-all",
    rotate: "opacity-0 rotate-90 origin-center transition-all",
    "fade-scale": "opacity-0 scale-98 transition-all",
  };
  
  const durationClass = {
    fast: "duration-fast",
    default: "duration-default",
    slow: "duration-slow",
    "very-slow": "duration-very-slow",
  };
  
  const activeClass = "opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0";
  
  return (
    <div
      className={cn(
        animationClass[type],
        durationClass[duration],
        isAnimating && activeClass,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface MotionGroupProps {
  children: React.ReactNode;
  animate?: boolean;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
}

/**
 * MotionGroup - A container for sequentially animated children
 */
export function MotionGroup({
  children,
  animate = true,
  staggerDelay = 50,
  initialDelay = 0,
  className,
}: MotionGroupProps) {
  return (
    <div className={className || undefined}>
      {children}
    </div>
  );
} 