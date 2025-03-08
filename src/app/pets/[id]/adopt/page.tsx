'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AdoptionRequestForm } from '@/components/adoptions/adoption-request-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/hooks/use-auth';

export default function AdoptPage() {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const supabase = createClientComponentClient();
  
  // Fetch pet data
  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (!params.id) {
          setError('No pet ID provided');
          setLoading(false);
          return;
        }
        
        // Fetch pet directly from Supabase
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', params.id as string)
          .single();
          
        if (error) {
          console.error('Error fetching pet:', error);
          setError(error.message);
        } else if (!data) {
          setError('Pet not found');
        } else {
          setPet(data);
        }
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError('Failed to load pet information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPet();
  }, [params.id, supabase]);
  
  const handleSuccess = () => {
    router.push(`/pets/${params.id}/adopt/success`);
  };
  
  const handleCancel = () => {
    router.push(`/pets/${params.id}`);
  };
  
  if (isAuthLoading || loading) {
    return (
      <div className="container max-w-3xl py-10">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  if (error || !pet) {
    return (
      <div className="container max-w-3xl py-10">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-800">Error</h2>
          <p className="text-red-700 mt-2">
            {error || 'Failed to load pet information'}
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">Adopt {pet.name}</h1>
      <p className="text-muted-foreground mb-8">
        Please fill out the form below to request adoption for {pet.name}. We'll review your request and get back to you as soon as possible.
      </p>
      
      <AdoptionRequestForm 
        pet={pet} 
        onSuccess={handleSuccess} 
        onCancel={handleCancel} 
      />
    </div>
  );
} 