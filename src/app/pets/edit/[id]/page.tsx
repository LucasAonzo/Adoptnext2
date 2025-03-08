'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { updatePet } from '@/app/actions/pets';
import { PetForm } from '@/components/pets/pet-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase';
import { Pet } from '@/types/pets';
import { Skeleton } from '@/components/ui/skeleton';

interface EditPetPageProps {
  params: {
    id: string;
  };
}

export default function EditPetPage({ params }: EditPetPageProps) {
  // Store the ID in a state variable to avoid direct access to params.id
  const [petId, setPetId] = useState<string>('');
  const pathname = usePathname();
  
  // Set the ID once when the component mounts
  useEffect(() => {
    // Extract the ID from the pathname instead of accessing params.id directly
    const pathSegments = pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    if (id) {
      setPetId(id);
      console.log('Pet ID extracted from pathname:', id);
    }
  }, [pathname]);
  
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  // Fetch the pet data
  useEffect(() => {
    async function fetchPet() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', petId)
          .single();
        
        if (error) {
          console.error('Error fetching pet:', error);
          setError('Failed to load pet data');
          return;
        }
        
        setPet(data as Pet);
      } catch (error) {
        console.error('Error fetching pet:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (petId) {
      fetchPet();
    }
  }, [petId]);

  // Check authentication and ownership
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('You must be logged in to edit a pet');
      router.push('/auth?redirect=/pets/edit/' + petId);
      return;
    }
    
    if (!isLoading && pet && user && pet.owner_id !== user.id) {
      toast.error('You can only edit your own pets');
      router.push('/pets/' + petId);
      return;
    }
  }, [authLoading, isAuthenticated, isLoading, pet, user, router, petId]);

  const handleSubmit = async (data: any) => {
    try {
      // Double-check authentication before submitting
      if (!isAuthenticated || !user) {
        console.error('Authentication required to edit a pet');
        toast.error('You must be logged in to edit a pet');
        router.push('/auth?redirect=/pets/edit/' + petId);
        return { success: false, error: 'Authentication required' };
      }

      // Double-check ownership before submitting
      if (pet && pet.owner_id !== user.id) {
        console.error('Unauthorized edit attempt');
        toast.error('You can only edit your own pets');
        router.push('/pets/' + petId);
        return { success: false, error: 'Unauthorized' };
      }

      console.log('Updating pet with data:', data);
      setIsSubmitting(true);
      
      // Create a FormData object to submit
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string);
          console.log(`Adding form field: ${key} = ${value}`);
        }
      });
      
      // Add the owner_id field with the user's ID
      formData.append('owner_id', user.id);
      console.log(`Adding owner_id: ${user.id}`);
      
      // Submit the form using the server action
      console.log('Submitting form to server action...');
      const result = await updatePet(petId, formData);
      
      console.log('Server action result:', result);
      
      if (result.success) {
        toast.success('Pet updated successfully!');
        // Redirect to the pet detail page after a short delay
        setTimeout(() => {
          router.push('/pets/' + petId);
          router.refresh();
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to update pet');
      }
      
      return result;
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Edit Pet</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error || !pet) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Error</CardTitle>
            <CardDescription>{error || 'Pet not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              onClick={() => router.push('/pets')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
            >
              Back to Pets
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Edit Pet</CardTitle>
          <CardDescription>Update your pet's information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <PetForm 
            pet={pet}
            onSubmit={handleSubmit} 
            submitButtonText="Update Pet" 
            userId={user?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
} 