'use client';

import { Pet as PetType } from '@/types/pets';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ui } from '@/lib/ui.config';

// Default image to use when pet image is not available
const DEFAULT_PET_IMAGE = '/images/default-pet.jpg';

// Extended Pet type to match our database values
interface Pet extends Omit<PetType, 'size' | 'gender'> {
  size: string;
  gender: string;
}

interface PetCardProps {
  pet: PetType;
  layout?: 'vertical' | 'horizontal';
  isLoading?: boolean;
}

/**
 * Badge component for consistent attribute styling
 */
function PetBadge({ children, variant = 'primary' }: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'status'
}) {
  return (
    <span 
      className={cn(
        "text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5",
        variant === 'primary' 
          ? "bg-[color:var(--primary-lighter)] text-[color:var(--primary-dark)]" 
          : "bg-[color:var(--complementary)] text-[color:var(--foreground)]"
      )}
      style={{
        fontSize: ui.typography.fontSize.xs,
        fontWeight: ui.typography.fontWeight.medium,
        boxShadow: variant === 'status' ? ui.shadows.sm : 'none',
      }}
    >
      {children}
    </span>
  );
}

/**
 * Image component with overlay and loading states
 */
function PetCardImage({ 
  src, 
  petName, 
  status, 
  statusText,
  layout = 'vertical',
}: { 
  src: string | null; 
  petName: string; 
  status: string; 
  statusText: string;
  layout?: 'vertical' | 'horizontal';
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const actualSrc = imageError || !src ? DEFAULT_PET_IMAGE : src;
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden group bg-gradient-to-br from-[color:var(--primary-lighter)] to-[color:var(--primary-light)]",
        layout === 'vertical' ? "rounded-t-xl aspect-[4/3]" : "rounded-l-xl h-full min-h-[180px]"
      )}
    >
      {/* Loading state animation */}
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[color:var(--primary-lighter)] via-[color:var(--primary-light)] to-[color:var(--primary-lighter)] bg-size-200 animate-shimmer" />
      )}
      
      {/* Actual image */}
      <Image
        src={actualSrc}
        alt={`Photo of ${petName}`}
        fill
        className={cn(
          "object-cover z-10 transition-all duration-500",
          "group-hover:scale-110 group-hover:rotate-1",
          !imageLoaded && "opacity-0",
          imageLoaded && "opacity-100"
        )}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Status badge */}
      {status !== 'disponible' && (
        <div className="absolute top-3 right-3 z-30">
          <PetBadge variant="status">{statusText}</PetBadge>
        </div>
      )}
      
      {/* Always present overlay gradient (stronger on hover) */}
      <div 
        className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" 
        aria-hidden="true" 
      />
      
      {/* Bottom content in image area */}
      <div className="absolute bottom-0 left-0 z-30 p-4 w-full">
        <h3 
          className="text-white font-bold mb-1 text-lg md:text-xl group-hover:translate-y-[-2px] transition-transform"
          style={{ 
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            fontWeight: ui.typography.fontWeight.bold
          }}
        >
          {petName}
        </h3>
        <p 
          className="text-white/90 text-sm group-hover:translate-y-[-2px] transition-transform" 
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
        >
          {layout === 'vertical' ? `${petName} is waiting for a home` : ''}
        </p>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for the card when data is loading
 */
function PetCardSkeleton({ layout = 'vertical' }: { layout?: 'vertical' | 'horizontal' }) {
  return (
    <Card 
      className={cn(
        "overflow-hidden border-0 bg-white",
        layout === 'horizontal' ? "flex flex-row" : "flex flex-col"
      )}
      style={{
        borderRadius: ui.radius.xl,
        boxShadow: "0 8px 20px rgba(139, 92, 246, 0.15)",
      }}
    >
      <div 
        className={cn(
          "animate-pulse bg-gradient-to-r from-[color:var(--primary-lighter)] via-[color:var(--primary-light)] to-[color:var(--primary-lighter)] bg-size-200 animate-shimmer",
          layout === 'horizontal' ? "w-1/3 min-h-[200px] rounded-l-xl" : "h-48 w-full rounded-t-xl"
        )} 
      />
      <div className="flex flex-col flex-1 p-5 space-y-4">
        <div className="h-6 rounded-md w-2/3 animate-pulse bg-[color:var(--primary-lighter)]" />
        <div className="h-4 rounded-md w-1/2 animate-pulse bg-[color:var(--primary-lighter)]/70" />
        <div className="space-y-2">
          <div className="h-3 rounded-md w-full animate-pulse bg-[color:var(--primary-lighter)]/50" />
          <div className="h-3 rounded-md w-5/6 animate-pulse bg-[color:var(--primary-lighter)]/50" />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="h-8 rounded-full animate-pulse bg-[color:var(--primary-lighter)]/60" 
              style={{ width: `${i * 5 + 10}%`, maxWidth: '80px' }} 
            />
          ))}
        </div>
        <div className="h-12 rounded-full animate-pulse bg-[color:var(--primary-light)] mt-auto" />
      </div>
    </Card>
  );
}

/**
 * Pet Card Component
 * Displays a pet with image, information, and adoption/view button
 */
export function PetCard({ pet, layout = 'vertical', isLoading = false }: PetCardProps) {
  // Show skeleton loader when loading
  if (isLoading) {
    return <PetCardSkeleton layout={layout} />;
  }
  
  // Cast to our extended Pet type
  const petData = pet as unknown as Pet;
  
  // Image source
  const [imageError, setImageError] = useState(false);
  const hasValidImage = !imageError && petData.image_url && petData.image_url.trim() !== '';
  const src = hasValidImage ? petData.image_url : DEFAULT_PET_IMAGE;

  // Convert pet status to display text
  const statusText = {
    disponible: 'Available',
    en_proceso: 'In Process',
    adoptado: 'Adopted',
  }[petData.status] || 'Available';

  // Format the size for display
  const sizeText = {
    Pequeño: 'Small',
    Mediano: 'Medium',
    Grande: 'Large',
  }[petData.size] || petData.size;
  
  // Convert pet type to display text
  const typeText = {
    perro: 'Dog',
    gato: 'Cat',
    otro: 'Other',
  }[petData.type] || 'Pet';

  // Convert gender for display
  const genderText = {
    Macho: 'Male',
    Hembra: 'Female',
  }[petData.gender] || petData.gender;

  // Button text based on status
  const buttonText = petData.status === 'disponible' ? 'Adopt Now' : 'View Details';
  const buttonStyles = {
    backgroundColor: petData.status === 'disponible' 
      ? 'var(--primary)' 
      : 'var(--complementary)',
    color: '#ffffff',
    fontSize: ui.typography.fontSize.sm,
    fontWeight: ui.typography.fontWeight.medium,
    borderRadius: '9999px', // Full rounded
    padding: '0.75rem 1.5rem',
    boxShadow: ui.shadows.md,
    transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`,
  };

  // Horizontal layout
  if (layout === 'horizontal') {
    return (
      <Link 
        href={`/pets/${petData.id}`} 
        className="block group h-full" 
        aria-label={`View details of ${petData.name}, a ${petData.breed} ${typeText}`}
      >
        <Card 
          className="overflow-hidden bg-white flex flex-col sm:flex-row h-full border-0 hover:shadow-lg hover:shadow-[color:var(--primary-lighter)]/20 transition-all duration-300 transform hover:-translate-y-1"
          style={{
            borderRadius: ui.radius.xl,
            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.1)",
          }}
        >
          {/* Image section */}
          <div className="relative sm:w-2/5 md:w-1/3">
            <PetCardImage
              src={src}
              petName={petData.name}
              status={petData.status}
              statusText={statusText}
              layout="horizontal"
            />
            </div>
            
          <div className="flex flex-col flex-1 p-5">
            <div className="flex flex-col space-y-1">
              <div className="flex items-start justify-between">
                  <div>
                  <h3
                    className="text-lg font-bold text-[color:var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors"
                  >
                      {petData.name}
                  </h3>
                  <p
                    className="text-sm font-medium text-[color:var(--primary)]"
                  >
                      {petData.breed} · {typeText}
                  </p>
                  </div>
                
                  {petData.age && (
                  <div className="flex items-center">
                    <PetBadge>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
                        <path d="M8 2v4"/>
                        <path d="M16 2v4"/>
                        <rect width="18" height="18" x="3" y="4" rx="2"/>
                        <path d="M3 10h18"/>
                      </svg>
                      {petData.age} years
                    </PetBadge>
                  </div>
                  )}
                </div>
            </div>
            
            <div className="mt-3">
              <p 
                className="text-sm line-clamp-2 text-[color:var(--muted-foreground)]"
              >
                {petData.description || `Meet ${petData.name}, a lovely ${petData.breed} looking for a forever home.`}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
                  {petData.size && (
                <PetBadge>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ruler">
                    <path d="M21 8H3"/>
                    <path d="M21 12H3"/>
                    <path d="M21 16H3"/>
                    <path d="M17 3v18"/>
                    <path d="M7 3v18"/>
                  </svg>
                      {sizeText}
                </PetBadge>
                  )}
                  {petData.gender && (
                <PetBadge>
                  {petData.gender === 'Macho' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mars">
                      <circle cx="10" cy="14" r="5"/>
                      <path d="m17 3-3 3"/>
                      <path d="m14 6 3-3"/>
                      <path d="M14 3h3v3"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-venus">
                      <circle cx="12" cy="10" r="5"/>
                      <path d="M12 15v7"/>
                      <path d="M9 18h6"/>
                    </svg>
                  )}
                  {genderText}
                </PetBadge>
                  )}
                </div>
              
            <div className="mt-auto pt-5">
                <Button
                className="w-full group/button"
                style={buttonStyles}
              >
                <span className="flex items-center justify-center gap-2">
                  {buttonText}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover/button:translate-x-1"
                  >
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </span>
                </Button>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Vertical layout (default)
  return (
    <Link 
      href={`/pets/${petData.id}`} 
      className="block group h-full" 
      aria-label={`View details of ${petData.name}, a ${petData.breed} ${typeText}`}
    >
      <Card 
        className="overflow-hidden bg-white flex flex-col h-full border-0 hover:shadow-lg hover:shadow-[color:var(--primary-lighter)]/20 transition-all duration-300 transform hover:-translate-y-1"
        style={{
          borderRadius: ui.radius.xl,
          boxShadow: "0 4px 15px rgba(139, 92, 246, 0.1)",
        }}
      >
        {/* Image section - taking up more space in vertical layout */}
        <div className="relative">
          <PetCardImage
            src={src}
            petName={petData.name}
            status={petData.status}
            statusText={statusText}
          />
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-sm font-medium text-[color:var(--primary)]"
              >
            {petData.breed} · {typeText}
              </p>
            </div>
            
            {petData.age && (
              <div className="flex items-center">
                <PetBadge>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
                    <path d="M8 2v4"/>
                    <path d="M16 2v4"/>
                    <rect width="18" height="18" x="3" y="4" rx="2"/>
                    <path d="M3 10h18"/>
                  </svg>
                {petData.age} years
                </PetBadge>
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <p 
              className="text-sm line-clamp-2 text-[color:var(--muted-foreground)]"
            >
              {petData.description || `Meet ${petData.name}, a lovely ${petData.breed} looking for a forever home.`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {petData.size && (
              <PetBadge>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ruler">
                  <path d="M21 8H3"/>
                  <path d="M21 12H3"/>
                  <path d="M21 16H3"/>
                  <path d="M17 3v18"/>
                  <path d="M7 3v18"/>
                </svg>
                {sizeText}
              </PetBadge>
            )}
            {petData.gender && (
              <PetBadge>
                {petData.gender === 'Macho' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mars">
                    <circle cx="10" cy="14" r="5"/>
                    <path d="m17 3-3 3"/>
                    <path d="m14 6 3-3"/>
                    <path d="M14 3h3v3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-venus">
                    <circle cx="12" cy="10" r="5"/>
                    <path d="M12 15v7"/>
                    <path d="M9 18h6"/>
                  </svg>
                )}
                {genderText}
              </PetBadge>
            )}
          </div>
          
          <div className="mt-auto pt-5">
          <Button
              className="w-full group/button"
              style={buttonStyles}
            >
              <span className="flex items-center justify-center gap-2">
                {buttonText}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover/button:translate-x-1"
                >
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
              </svg>
            </span>
          </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
} 