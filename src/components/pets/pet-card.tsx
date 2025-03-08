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
}

export function PetCard({ pet, layout = 'vertical' }: PetCardProps) {
  // Cast to our extended Pet type
  const petData = pet as unknown as Pet;
  
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

  if (layout === 'horizontal') {
    return (
      <Link href={`/pets/${petData.id}`} className="block group">
        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
          <div className="flex flex-col sm:flex-row">
            <div className="relative h-48 sm:h-auto sm:w-1/3 sm:min-h-[200px] bg-gray-100">
              <Image
                src={src}
                alt={`Photo of ${petData.name}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                onError={() => setImageError(true)}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {petData.status !== 'disponible' && (
                <div className="absolute top-2 right-2 bg-secondary px-2 py-1 rounded-full text-xs font-medium">
                  {statusText}
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {petData.name}
                    </CardTitle>
                    <CardDescription>
                      {petData.breed} · {typeText}
                    </CardDescription>
                  </div>
                  {petData.age && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {petData.age} years
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="text-sm line-clamp-2 mb-3">{petData.description}</p>
                <div className="flex flex-wrap gap-2">
                  {petData.size && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {sizeText}
                    </span>
                  )}
                  {petData.gender && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {genderText}
                    </span>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  variant={petData.status === 'disponible' ? 'default' : 'secondary'}
                  className="w-full"
                >
                  {petData.status === 'disponible' ? 'Adopt Now' : 'View Details'}
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/pets/${petData.id}`} className="block group">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={src}
            alt={`Photo of ${petData.name}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {petData.status !== 'disponible' && (
            <div className="absolute top-2 right-2 bg-secondary px-2 py-1 rounded-full text-xs font-medium">
              {statusText}
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors">
            {petData.name}
          </CardTitle>
          <CardDescription>
            {petData.breed} · {typeText}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm line-clamp-2">{petData.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {petData.age && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {petData.age} years
              </span>
            )}
            {petData.size && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {sizeText}
              </span>
            )}
            {petData.gender && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {genderText}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant={petData.status === 'disponible' ? 'default' : 'secondary'}
            className="w-full"
          >
            {petData.status === 'disponible' ? 'Adopt Now' : 'View Details'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
} 