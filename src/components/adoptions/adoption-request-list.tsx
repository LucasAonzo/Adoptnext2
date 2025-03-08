'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AdoptionStatusBadge } from './adoption-status-badge';
import { PetImage } from '@/components/pets/pet-image';
import { toast } from 'sonner';
import { cancelAdoptionRequest } from '@/app/actions/adoptions';
import Link from 'next/link';

interface AdoptionRequest {
  id: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  message: string;
  created_at: string;
  pet_id: string;
  pets: {
    id: string;
    name: string;
    image_url: string | null;
    type: string;
    breed: string;
  };
}

interface AdoptionRequestListProps {
  adoptions: AdoptionRequest[];
  emptyMessage?: string;
}

export function AdoptionRequestList({ 
  adoptions, 
  emptyMessage = 'You have no adoption requests yet.' 
}: AdoptionRequestListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!adoptions || adoptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
        <Button asChild className="mt-4">
          <Link href="/pets">Browse Pets</Link>
        </Button>
      </div>
    );
  }

  const handleCancel = async (adoptionId: string) => {
    try {
      setLoadingId(adoptionId);
      const result = await cancelAdoptionRequest(adoptionId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success('Adoption request cancelled successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel adoption request');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {adoptions.map((adoption) => (
        <Card key={adoption.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">
                Request for {adoption.pets.name}
              </CardTitle>
              <AdoptionStatusBadge status={adoption.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Submitted on {formatDate(adoption.created_at)}
            </p>
          </CardHeader>
          
          <CardContent className="pt-2 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <PetImage 
                pet={adoption.pets} 
                className="rounded-md object-cover"
                containerClassName="aspect-square"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium mb-1">Your Message:</h3>
              <p className="text-sm whitespace-pre-line">{adoption.message}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="bg-muted rounded-md px-3 py-1 text-sm">
                  {adoption.pets.type}
                </div>
                <div className="bg-muted rounded-md px-3 py-1 text-sm">
                  {adoption.pets.breed}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button asChild variant="outline">
              <Link href={`/pets/${adoption.pet_id}`}>
                View Pet
              </Link>
            </Button>
            
            {adoption.status === 'pendiente' && (
              <Button 
                variant="destructive" 
                onClick={() => handleCancel(adoption.id)}
                disabled={loadingId === adoption.id}
              >
                {loadingId === adoption.id ? 'Cancelling...' : 'Cancel Request'}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 