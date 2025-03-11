'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './card';

/**
 * Enhanced card variants with modern styling and better user experience
 * 
 * These variants use a composition approach for maximum flexibility
 * while maintaining consistent styling and interaction patterns.
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Primary Card variant - for highlighting important content
 * 
 * @example
 * <PrimaryCard>
 *   <CardHeader>
 *     <CardTitle>Important Information</CardTitle>
 *   </CardHeader>
 *   <CardContent>This is highlighted content</CardContent>
 * </PrimaryCard>
 */
export function PrimaryCard({ className, children, ...props }: CardProps) {
  return (
    <Card 
      className={cn(
        "bg-primary text-primary-foreground border-transparent",
        "shadow-lg shadow-primary/20",
        "hover:shadow-xl hover:shadow-primary/25",
        "transition-all duration-300",
        "relative overflow-hidden",
        className
      )} 
      {...props}
    >
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      {children}
    </Card>
  );
}

/**
 * Outlined Card variant - for secondary information with a clean look
 * 
 * @example
 * <OutlinedCard>
 *   <CardHeader>
 *     <CardTitle>Additional Details</CardTitle>
 *   </CardHeader>
 *   <CardContent>Supporting content</CardContent>
 * </OutlinedCard>
 */
export function OutlinedCard({ className, children, ...props }: CardProps) {
  return (
    <Card 
      className={cn(
        "bg-background border-2 border-primary/20",
        "hover:border-primary/40 transition-colors duration-300",
        "shadow-none hover:shadow-sm",
        "relative overflow-hidden",
        className
      )} 
      {...props}
    >
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      {children}
    </Card>
  );
}

/**
 * Feature Card variant - for showcasing features or products
 * 
 * @example
 * <FeatureCard>
 *   <CardHeader>
 *     <CardTitle>Feature Name</CardTitle>
 *     <CardDescription>Feature description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Feature details</CardContent>
 * </FeatureCard>
 */
export function FeatureCard({ className, children, ...props }: CardProps) {
  return (
    <Card 
      className={cn(
        "border-none bg-gradient-to-br from-card to-background",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300 hover:-translate-y-1",
        "group",
        className
      )} 
      {...props}
    >
      <div className="absolute inset-0 rounded-xl border-2 border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {children}
    </Card>
  );
}

/**
 * Compact Card variant - for dense layouts
 * 
 * @example
 * <CompactCard>
 *   <CardHeader className="p-4 pb-2">
 *     <CardTitle className="text-base">Compact Title</CardTitle>
 *   </CardHeader>
 *   <CardContent className="p-4 pt-0">Compact content</CardContent>
 * </CompactCard>
 */
export function CompactCard({ className, children, ...props }: CardProps) {
  return (
    <Card 
      className={cn(
        "border-border/20 shadow-sm",
        "hover:bg-accent/5 hover:border-border/30",
        "transition-all duration-200",
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
}

/**
 * Interactive Card variant - for clickable elements
 * 
 * @example
 * <InteractiveCard onClick={() => console.log('Clicked')}>
 *   <CardContent>Click me</CardContent>
 * </InteractiveCard>
 */
export function InteractiveCard({ className, children, ...props }: CardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer border-border/30",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200",
        "hover:-translate-y-1 active:translate-y-0",
        "hover:bg-accent/5 active:bg-accent/10",
        "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2",
        // Pulse effect on hover
        "after:absolute after:inset-0 after:rounded-xl after:border-2 after:border-primary/0",
        "hover:after:border-primary/20 after:transition-all after:duration-500",
        "after:scale-[1.02] hover:after:scale-105",
        "overflow-visible relative",
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
} 