'use client';

import { Pet } from '@/types/pets';
import { PetCard } from '@/components/pets/pet-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PawPrint, PlusCircle } from 'lucide-react';

interface UserPetsListProps {
  pets: Pet[] | null | undefined;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function UserPetsList({
  pets,
  isLoading = false,
  emptyMessage = "You haven't published any pets yet."
}: UserPetsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-[400px] rounded-lg border p-4 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (!pets) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <PawPrint className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium mb-2">No Data Available</h3>
        <p className="text-muted-foreground mb-6">We couldn't retrieve your pets at this time.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <PawPrint className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium mb-2">No Pets Found</h3>
        <p className="text-muted-foreground mb-6">{emptyMessage}</p>
        <Button asChild>
          <Link href="/pets/create" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Your First Pet
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Published Pets</h3>
        <Button asChild size="sm" variant="outline">
          <Link href="/pets/create" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Publish New Pet
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
} 