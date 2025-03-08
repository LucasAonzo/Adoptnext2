'use client';

import { PetCard } from './pet-card';
import { type Pet } from '@/types/pets';

interface PetListProps {
  pets: Pet[];
}

export function PetList({ pets }: PetListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
} 