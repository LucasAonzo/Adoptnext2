import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PetDetailLoading from './loading';
import { supabase } from '@/lib/supabase';
import { Pet } from '@/types/pets';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PetImage } from '@/components/pets/pet-image';
import { PetAttributes } from '@/components/pets/pet-attributes';
import { PetOwnerActionsWrapper } from '@/components/pets/pet-owner-actions-wrapper';

// Define the type for the params
interface PageParams {
  id: string;
}

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  // Extract the id from params
  const id = params?.id;
  
  if (!id) {
    return {
      title: 'Pet Not Found',
      description: 'The requested pet could not be found',
    };
  }
  
  try {
    const pet = await getPet(id);
    
    if (!pet) {
      return {
        title: 'Pet Not Found',
        description: 'The requested pet could not be found',
      };
    }
    
    return {
      title: `${pet.name} - Adopt Me`,
      description: pet.description || `Meet ${pet.name}, a lovely pet looking for a home`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the pet',
    };
  }
}

async function getPet(id: string): Promise<Pet | null> {
  try {
    // Check if id is valid
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.log('Invalid pet ID:', id);
      return null;
    }
    
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Check if it's a "not found" error
      if (error.code === 'PGRST116') {
        console.log(`Pet not found with ID: ${id}`);
        return null;
      }
      
      // Log other errors
      console.error('Error fetching pet:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      return null;
    }

    if (!data) {
      console.log(`No data returned for pet with ID: ${id}`);
      return null;
    }

    return data as Pet;
  } catch (error) {
    // Provide more detailed error logging
    console.error('Error fetching pet:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });
    return null;
  }
}

export default async function PetDetailPage({ params }: { params: PageParams }) {
  // Extract the id from params
  const id = params?.id;
  
  if (!id) {
    notFound();
  }
  
  try {
    const pet = await getPet(id);
    
    // If pet not found, show 404
    if (!pet) {
      notFound();
    }
    
    return (
      <div className="container mx-auto py-8">
        <Suspense fallback={<PetDetailLoading />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PetImage pet={pet} />
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold">{pet.name}</h1>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{pet.type}</Badge>
                      <Badge variant="outline">{pet.breed}</Badge>
                      <Badge variant={pet.status === 'disponible' ? 'secondary' : 'outline'}>
                        {pet.status === 'disponible' ? 'Available' : pet.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Use the client component wrapper for edit/delete buttons */}
                  <div className="flex gap-2">
                    <PetOwnerActionsWrapper pet={pet} />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground">{pet.description || 'No description available.'}</p>
                </div>
                
                <PetAttributes pet={pet} />
                
                {/* Additional images section - temporarily disabled until Pet type is updated
                {pet.additional_images && pet.additional_images.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">More Photos</h2>
                    <div className="grid grid-cols-3 gap-2">
                      {pet.additional_images.map((image: string, index: number) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                          <Image
                            src={image}
                            alt={`${pet.name} photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                */}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/pets">Back to Pets</Link>
                </Button>
                
                {pet.status === 'disponible' && (
                  <Button asChild>
                    <Link href={`/pets/${pet.id}/adopt`}>Adopt Me</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error rendering pet detail page:', error);
    throw error; // Let the nearest error boundary handle it
  }
} 