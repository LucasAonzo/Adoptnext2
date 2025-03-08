'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Pet } from '@/types/pets';

export const DEFAULT_PET_IMAGE = '/images/default-pet.jpg';

export interface PetImageProps {
  /**
   * The pet to display the image for
   */
  pet: Pet | null;
  
  /**
   * Whether this is a priority image (LCP)
   */
  priority?: boolean;
  
  /**
   * Optional width - if not provided, will use fill
   */
  width?: number;
  
  /**
   * Optional height - if not provided, will use fill
   */
  height?: number;
  
  /**
   * Optional CSS classes to add
   */
  className?: string;
  
  /**
   * Container CSS classes
   */
  containerClassName?: string;
  
  /**
   * Image sizes for responsive loading
   */
  sizes?: string;
  
  /**
   * Whether to show loading skeleton
   */
  showSkeleton?: boolean;
  
  /**
   * Whether to use blur-up effect
   */
  useBlurEffect?: boolean;
  
  /**
   * Alt text override - defaults to pet name
   */
  alt?: string;
}

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop';

/**
 * Optimized responsive image component for pets.
 * Handles loading states, fallbacks, and optimized delivery.
 */
export function PetImage({
  pet,
  priority = false,
  width,
  height,
  className,
  containerClassName,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  showSkeleton = true,
  useBlurEffect = true,
  alt,
}: PetImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Get the image URL, using default if missing or on error
  const imageUrl = error || !pet?.image_url || pet.image_url.trim() === '' 
    ? DEFAULT_IMAGE_URL 
    : pet.image_url;
  
  // Handle image load completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  
  // Handle image error
  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };
  
  // Default alt text is pet name
  const altText = alt || `Photo of ${pet?.name || 'a pet'}`;
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted", 
        !width && !height ? "aspect-square" : "",
        isLoading && showSkeleton ? "animate-pulse" : "",
        containerClassName
      )}
      style={width && height ? { width, height } : undefined}
    >
      <Image
        src={imageUrl}
        alt={altText}
        priority={priority}
        sizes={sizes}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        className={cn(
          "object-cover duration-700 ease-in-out", 
          useBlurEffect && isLoading ? "scale-110 blur-sm" : "scale-100 blur-0",
          className
        )}
        {...(width && height 
          ? { width, height } 
          : { fill: true }
        )}
      />
    </div>
  );
} 