'use client';

import { useEffect, useState } from 'react';
import { Pet } from '@/types/pets';
import { PetOwnerActions } from './pet-owner-actions';
import { useAuthStore } from '@/lib/stores/auth-store';

interface PetOwnerActionsWrapperProps {
  pet: Pet;
}

export function PetOwnerActionsWrapper({ pet }: PetOwnerActionsWrapperProps) {
  const [isOwner, setIsOwner] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  useEffect(() => {
    // Check if the current user is the owner of the pet
    if (isAuthenticated && user && pet.owner_id === user.id) {
      console.log('Client: User is the owner of this pet', {
        userId: user.id,
        petOwnerId: pet.owner_id,
        petId: pet.id
      });
      setIsOwner(true);
    } else {
      console.log('Client: User is NOT the owner of this pet', {
        isAuthenticated,
        hasUser: !!user,
        userId: user?.id,
        petOwnerId: pet.owner_id,
        petId: pet.id
      });
      setIsOwner(false);
    }
  }, [isAuthenticated, user, pet]);
  
  // Only render the actions if the user is the owner
  if (!isOwner) {
    return null;
  }
  
  return <PetOwnerActions pet={pet} />;
} 