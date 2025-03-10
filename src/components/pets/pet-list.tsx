'use client';

import { PetCard } from './pet-card';
import { type Pet } from '@/types/pets';

interface PetListProps {
  pets: Pet[];
  isLoading?: boolean;
  emptyMessage?: string;
  title?: string;
}

/**
 * Pet List Component
 * Renders a responsive grid of pet cards with loading states
 */
export function PetList({ 
  pets, 
  isLoading = false, 
  emptyMessage = "No pets available at the moment", 
  title,
}: PetListProps) {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold leading-tight text-foreground">
            {title}
          </h2>
          <div className="mt-2 h-1 w-24 rounded-full bg-primary" />
        </div>
      )}

      {/* Show loading skeleton cards */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {Array.from({ length: 6 }).map((_, index) => (
            <PetCard key={`skeleton-${index}`} pet={{} as Pet} isLoading={true} />
          ))}
        </div>
      )}

      {/* Show empty state message when no pets and not loading */}
      {!isLoading && pets.length === 0 && (
        <div className="bg-white rounded-xl p-8 border border-border shadow-sm text-center animate-fade-in">
          <div className="flex flex-col items-center justify-center py-10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary-light mb-4"
            >
              <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
              <path d="M14.5 5.171c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.344-2.5"/>
              <path d="M8 14v.5"/>
              <path d="M16 14v.5"/>
              <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>
              <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
            </svg>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              No Pets Found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {emptyMessage}
            </p>
          </div>
        </div>
      )}

      {/* Show the list of pets when there are pets and not loading */}
      {!isLoading && pets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
} 