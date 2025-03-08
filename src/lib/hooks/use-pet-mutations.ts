'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pet } from '@/types/pets';
import { createPet, updatePet, deletePet, updatePetStatus, ActionResult } from '@/app/actions/pets';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PetMutationOptions {
  /**
   * Whether to navigate after successful mutation
   */
  navigateAfterSuccess?: boolean;
  /**
   * Where to navigate after successful mutation
   */
  navigateTo?: string;
}

/**
 * Hook for creating a new pet with optimistic UI
 */
export function useCreatePet(options: PetMutationOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createPet(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet created successfully');
      
      if (options.navigateAfterSuccess && data) {
        router.push(options.navigateTo || `/pets/${data.id}`);
      }
    },
    
    onError: (error) => {
      toast.error(`Failed to create pet: ${error.message}`);
    },
  });
}

/**
 * Hook for updating a pet with optimistic UI
 */
export function useUpdatePet(petId: string, options: PetMutationOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updatePet(petId, formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    
    onMutate: async (formData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pets', petId] });
      
      // Snapshot previous value
      const previousPet = queryClient.getQueryData<Pet>(['pets', petId]);
      
      // Create optimistic pet from form data
      const formEntries = Object.fromEntries(formData.entries());
      
      // Optimistically update the cache
      if (previousPet) {
        queryClient.setQueryData<Pet>(['pets', petId], {
          ...previousPet,
          ...formEntries,
        });
      }
      
      return { previousPet };
    },
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', petId] });
      toast.success('Pet updated successfully');
      
      if (options.navigateAfterSuccess) {
        router.push(options.navigateTo || `/pets/${petId}`);
      }
    },
    
    onError: (error, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousPet) {
        queryClient.setQueryData(['pets', petId], context.previousPet);
      }
      toast.error(`Failed to update pet: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a pet with optimistic UI
 */
export function useDeletePet(options: PetMutationOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (petId: string) => {
      const result = await deletePet(petId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    
    onMutate: async (petId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pets'] });
      
      // Snapshot previous pets
      const previousPets = queryClient.getQueryData<Pet[]>(['pets']);
      
      // Optimistically update the cache
      if (previousPets) {
        queryClient.setQueryData<Pet[]>(
          ['pets'],
          previousPets.filter(pet => pet.id !== petId)
        );
      }
      
      return { previousPets };
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet deleted successfully');
      
      if (options.navigateAfterSuccess) {
        router.push(options.navigateTo || '/pets');
      }
    },
    
    onError: (error, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousPets) {
        queryClient.setQueryData(['pets'], context.previousPets);
      }
      toast.error(`Failed to delete pet: ${error.message}`);
    },
  });
}

/**
 * Hook for updating a pet's status with optimistic UI
 */
export function useUpdatePetStatus(petId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (status: 'disponible' | 'en_proceso' | 'adoptado') => {
      const result = await updatePetStatus(petId, status);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    
    onMutate: async (status) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pets', petId] });
      
      // Snapshot previous value
      const previousPet = queryClient.getQueryData<Pet>(['pets', petId]);
      
      // Optimistically update the cache
      if (previousPet) {
        queryClient.setQueryData<Pet>(['pets', petId], {
          ...previousPet,
          status,
        });
      }
      
      return { previousPet };
    },
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', petId] });
      toast.success(`Pet status updated to ${data?.status}`);
    },
    
    onError: (error, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousPet) {
        queryClient.setQueryData(['pets', petId], context.previousPet);
      }
      toast.error(`Failed to update pet status: ${error.message}`);
    },
  });
} 