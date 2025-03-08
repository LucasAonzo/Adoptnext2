'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPet } from '@/app/actions/pets';
import { PetForm } from '@/components/pets/pet-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function PublishPetPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  // Debug authentication state
  useEffect(() => {
    console.log('Auth state in publish page:', { 
      isAuthenticated, 
      isLoading, 
      hasUser: !!user,
      userEmail: user?.email,
      userId: user?.id
    });
  }, [isAuthenticated, isLoading, user]);

  // Check authentication status after the component mounts
  useEffect(() => {
    // Only redirect if authentication check is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      toast.error('You must be logged in to publish a pet');
      router.push('/auth?redirect=/pets/publish');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (data: any) => {
    try {
      // Double-check authentication before submitting
      if (!isAuthenticated || !user) {
        console.error('Authentication required to publish a pet');
        toast.error('You must be logged in to publish a pet');
        router.push('/auth?redirect=/pets/publish');
        return { success: false, error: 'Authentication required' };
      }

      console.log('Publishing pet with data:', data);
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
      
      // Set status to 'disponible' by default
      formData.append('status', 'disponible');
      console.log('Setting default status: disponible');
      
      // Add the owner_id field with the user's ID
      formData.append('owner_id', user.id);
      console.log(`Adding owner_id: ${user.id}`);
      
      // Submit the form using the server action
      console.log('Submitting form to server action...');
      const result = await createPet(formData);
      
      console.log('Server action result:', result);
      
      if (result.success) {
        toast.success('Pet published successfully!');
        // Redirect to the pets page after a short delay
        setTimeout(() => {
          router.push('/pets');
          router.refresh();
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to publish pet');
      }
      
      return result;
    } catch (error) {
      console.error('Error creating pet:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state or redirect if not authenticated
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Publish a Pet</CardTitle>
            <CardDescription>Loading authentication status...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Don't render the form if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Publish a Pet</CardTitle>
          <CardDescription>Fill out the form below to publish a pet for adoption.</CardDescription>
        </CardHeader>
        <CardContent>
          <PetForm 
            onSubmit={handleSubmit} 
            submitButtonText="Publish Pet" 
            userId={user?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
} 