'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './card';

/**
 * Example of creating card variants using composition instead of props
 * 
 * This approach allows for complete styling flexibility while maintaining
 * a clean component API focused on structure.
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
        "shadow-md hover:shadow-lg transition-shadow duration-200",
        className
      )} 
      {...props}
    >
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
        "bg-transparent border-2 border-primary/20",
        "hover:border-primary/50 transition-colors duration-200",
        className
      )} 
      {...props}
    >
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
        "border-border/30 bg-gradient-to-br from-card to-background",
        "shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5",
        className
      )} 
      {...props}
    >
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
        "hover:bg-accent/5 transition-colors duration-200",
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
        "shadow-sm hover:shadow-md transition-all duration-200",
        "hover:-translate-y-0.5 hover:bg-accent/5 active:translate-y-0",
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
} 