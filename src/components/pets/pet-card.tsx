'use client';

import { Pet as PetType } from '@/types/pets';
import Link from 'next/link';
import Image from 'next/image';
import { useState, memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, MapPin, Heart, ChevronRight, Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Status mapping for display
const STATUS_MAP: Record<
  string,
  { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; className?: string }
> = {
  disponible: { 
    label: 'Available', 
    variant: 'default',
    className: 'bg-violet-600 hover:bg-violet-700 text-white' 
  },
  adoptado: { 
    label: 'Adopted', 
    variant: 'secondary',
    className: 'bg-blue-500 text-white' 
  },
  en_proceso: { 
    label: 'In Process', 
    variant: 'outline',
    className: 'border-amber-500 text-amber-600 bg-amber-50' 
  },
  reservado: { 
    label: 'Reserved', 
    variant: 'default',
    className: 'bg-gray-500 text-white' 
  },
};

// Gender mapping for display
const GENDER_MAP: Record<string, { label: string; icon: 'male' | 'female' }> = {
  macho: { label: 'Male', icon: 'male' },
  hembra: { label: 'Female', icon: 'female' },
  male: { label: 'Male', icon: 'male' },
  female: { label: 'Female', icon: 'female' },
};

// Type mapping for display
const TYPE_MAP: Record<string, string> = {
  perro: 'Dog',
  gato: 'Cat',
  ave: 'Bird',
  exotico: 'Exotic',
  dog: 'Dog',
  cat: 'Cat',
  bird: 'Bird',
  exotic: 'Exotic',
};

// Helper function to truncate text
function truncate(text: string, maxLength: number) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Helper function to map status to badge variant
function mapBadgeVariant(variant: string): "default" | "outline" | "secondary" | "destructive" | undefined {
  switch (variant) {
    case 'default': return 'default';
    case 'outline': return 'outline';
    case 'secondary': return 'secondary';
    case 'destructive': return 'destructive';
    default: return undefined;
  }
}

interface PetCardProps {
  pet: PetType;
  className?: string;
  href?: string;
  onFavoriteToggle?: (petId: string, isFavorite: boolean) => void;
}

// Pet Card Image component with enhanced placeholder
const PetCardImage = memo(({ src, name }: { src?: string; name: string }) => {
  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-100">
      {src ? (
        <Image
          src={src}
          alt={`Photo of ${name}`}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center bg-gray-100"
          aria-label={`No photo available for ${name}`}
        >
          <span className="text-gray-400 text-lg font-medium">No photo available</span>
        </div>
      )}
    </div>
  );
});

PetCardImage.displayName = 'PetCardImage';

// Pet Status Badge component with custom styling
const PetStatusBadge = memo(({ status }: { status: typeof STATUS_MAP[keyof typeof STATUS_MAP] }) => {
  return (
    <Badge 
      variant={status.variant}
      className={cn("absolute top-4 right-4 z-10 shadow-sm", status.className)}
    >
      {status.label}
    </Badge>
  );
});

PetStatusBadge.displayName = 'PetStatusBadge';

// Favorite Button component
const FavoriteButton = memo(({ 
  isFavorite, 
  onClick 
}: { 
  isFavorite: boolean; 
  onClick: (e: React.MouseEvent) => void 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-4 left-4 z-10 p-2 rounded-full",
        "transition-all duration-200",
        "hover:scale-110 active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "shadow-sm bg-white text-gray-400 hover:text-rose-500"
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={cn(
          "h-5 w-5 transition-all duration-200", 
          isFavorite ? "fill-rose-500 text-rose-500" : "fill-none"
        )}
      />
    </button>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

export function PetCard({ pet, className = "", href, onFavoriteToggle }: PetCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Cast to handle pet type variations
  const petData = pet as any;
  
  // Format display values using useMemo for performance
  const displayData = useMemo(() => {
    // Get status from pet data
    const status = STATUS_MAP[petData.status] || STATUS_MAP.disponible;
    
    // Process traits - only use database values, no hardcoded fallbacks
    const traits = Array.isArray(petData.traits) ? petData.traits : 
                 (petData.personality_traits ? petData.personality_traits.split(',').map((t: string) => t.trim()) : 
                 []);
    
    return {
      status,
      typeText: TYPE_MAP[petData.type] || 'Pet',
      gender: GENDER_MAP[petData.gender] || { label: petData.gender || 'Unknown', icon: 'male' },
      imageUrl: petData.image_url || petData.image || petData.photo || null,
      petLink: href || `/pets/${petData.id}`,
      traits,
      name: petData.name || 'Unknown',
      breed: petData.breed || 'Unknown breed',
      age: petData.age !== undefined ? petData.age : null,
      shelter: petData.shelter || petData.shelter_name || 'Local Shelter',
      location: petData.location || petData.city || null,
      lastCheckup: petData.last_checkup || petData.medical_checkup || null,
      adoptionStatus: status.label || 'Available'
    };
  }, [petData, href]);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isFavorite;
    setIsFavorite(newState);
    
    // Call the callback if provided
    if (onFavoriteToggle) {
      onFavoriteToggle(petData.id, newState);
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden bg-white border border-gray-100 rounded-xl", 
        "transition-all duration-300 group",
        "hover:shadow-md hover:translate-y-[-2px]",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image section with badge and favorite button */}
      <div className="relative">
        <PetCardImage src={displayData.imageUrl} name={displayData.name} />
        <PetStatusBadge status={displayData.status} />
        <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteToggle} />
      </div>
      
      <CardContent className="sm:py-5 text-foreground/80 last:pb-6 p-4 pt-5">
        {/* Minimalist content section with mobile-friendly design */}
        <div className="flex flex-col gap-3">
          {/* Simplified header with subtler elements */}
          <div className="flex items-center justify-between">
            {/* Pet name with smaller, more elegant typography */}
            <div className="flex items-center">
              <div className="w-1 h-4 bg-violet-300 rounded-full mr-2 opacity-70"></div>
              <h3 className="text-lg font-medium text-gray-700 group-hover:text-violet-600 transition-colors">
                {displayData.name}
              </h3>
            </div>
            
            {/* Minimalist age indicator */}
            {displayData.age !== null && (
              <div className="flex items-center">
                <span className="text-sm font-normal text-gray-500 mr-1">
                  {displayData.age}
                </span>
                <span className="text-xs text-gray-400">
                  {displayData.age === 1 ? 'year' : 'yrs'}
                </span>
              </div>
            )}
          </div>
          
          {/* Minimal separator */}
          <div className="h-px w-full bg-gray-100"></div>
        </div>
      </CardContent>
      
      {/* Action Buttons - only View Details */}
      <CardFooter className="p-4 pt-0 flex justify-center">
        <Button 
          className={cn(
            "bg-violet-600 hover:bg-violet-700 text-white rounded-full",
            "flex items-center justify-center gap-1.5",
            "transition-all duration-200 w-full",
            "shadow-sm h-auto py-2.5 px-6"
          )}
          asChild
        >
          <Link href={displayData.petLink}>
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}