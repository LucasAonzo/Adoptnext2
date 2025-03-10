'use client';

import { Pet as PetType } from '@/types/pets';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart, Calendar, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Default image to use when pet image is not available
const DEFAULT_PET_IMAGE = '/images/default-pet.jpg';

// Status mapping for display
const STATUS_MAP: Record<
  string,
  { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' }
> = {
  disponible: { label: 'Available', variant: 'success' },
  adoptado: { label: 'Adopted', variant: 'secondary' },
  en_proceso: { label: 'In Process', variant: 'outline' },
  reservado: { label: 'Reserved', variant: 'default' },
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

// Size mapping for display
const SIZE_MAP: Record<string, string> = {
  pequeno: 'Small',
  mediano: 'Medium',
  grande: 'Large',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
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
}

export function PetCard({ pet, className = "", href }: PetCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Cast to handle pet type variations
  const petData = pet as any;
  
  // Determine image source with fallback
  const hasValidImage = !imageError && petData.image_url && petData.image_url.trim() !== '';
  const imageSrc = hasValidImage ? petData.image_url : DEFAULT_PET_IMAGE;
  
  // Format display values
  const status = STATUS_MAP[petData.status] || STATUS_MAP.disponible;
  const typeText = TYPE_MAP[petData.type] || 'Pet';
  const gender = GENDER_MAP[petData.gender] || { label: petData.gender || 'Unknown', icon: 'male' };
  
  // Determine link destination
  const petLink = href || `/pets/${petData.id}`;
  
  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className={cn(
      "overflow-hidden bg-white border-0 rounded-xl shadow-sm group",
      "hover:shadow-md transition-all duration-300",
      className
    )}>
      {/* Image section with badges */}
      <div className="relative h-56 w-full">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}
        
        <Image 
          src={imageSrc}
          alt={`${petData.name} - ${petData.breed || typeText}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-500",
            "group-hover:scale-105",
            !imageLoaded && "opacity-0",
            imageLoaded && "opacity-100",
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {/* Status badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge 
            variant={mapBadgeVariant(status.variant)}
            className={cn(
              "font-medium",
              gender.icon === 'male' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-pink-500 hover:bg-pink-600',
              "text-white"
            )}
          >
            {gender.label}
          </Badge>
        </div>
        
        {/* Favorite button */}
        <button
          onClick={handleFavoriteToggle}
          className={cn(
            "absolute top-3 left-3 z-10 p-2 rounded-full",
            "transition-all duration-300 transform",
            "hover:scale-110 active:scale-90",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isFavorite
              ? "bg-rose-500/90 text-white shadow-md"
              : "bg-white/80 text-muted-foreground hover:text-rose-500 backdrop-blur-sm"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-all duration-300", 
              isFavorite ? "fill-current" : "fill-none"
            )}
          />
        </button>
        
        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      {/* Content section */}
      <CardContent className="p-4 relative">
        <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors">
          {petData.name}
        </h3>
        
        <p className="text-primary/80 font-medium">
          {petData.breed || typeText}
        </p>
        
        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            <Calendar className="h-3 w-3" />
            {petData.age ? `${petData.age} ${petData.age === 1 ? 'year' : 'years'}` : 'Age unknown'}
          </span>
          
          {status.label !== 'Unknown' && (
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              status.variant === 'success' ? "bg-green-100 text-green-800" :
              status.variant === 'destructive' ? "bg-red-100 text-red-800" :
              status.variant === 'secondary' ? "bg-blue-100 text-blue-800" :
              "bg-gray-100 text-gray-800"
            )}>
              {status.label}
            </span>
          )}
        </div>
      </CardContent>
      
      {/* Footer with action button */}
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="default" 
          className="w-full justify-between transition-all shadow-sm group/button"
          asChild
        >
          <Link href={petLink} className="inline-flex items-center gap-2">
            <span>{petData.status === 'disponible' ? 'Adopt Me' : 'View Details'}</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}