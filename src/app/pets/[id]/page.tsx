import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PetDetailLoading from './loading';
import { supabase } from '@/lib/supabase';
import { Pet } from '@/types/pets';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs as UITabs, TabsContent as UITabsContent, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@/components/ui/tabs";
import { Separator as UISeparator } from "@/components/ui/separator";
import { ScrollArea as UIScrollArea } from "@/components/ui/scroll-area";
import Link from 'next/link';
import { PetImage } from '@/components/pets/pet-image';
import { PetAttributes } from '@/components/pets/pet-attributes';
import { PetOwnerActionsWrapper } from '@/components/pets/pet-owner-actions-wrapper';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Ruler, 
  ArrowLeft, 
  Info, 
  PawPrint,
  Clock
} from 'lucide-react';

// Define the type for the params
interface PageParams {
  id: string;
}

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  // Get the id using destructuring with Promise.resolve
  const { id } = await Promise.resolve(params);
  
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
      title: `${pet.name} - Adopt a Pet`,
      description: pet.description.substring(0, 160),
      openGraph: pet.image_url
        ? {
            images: [
              {
                url: pet.image_url,
                width: 1200,
                height: 630,
                alt: `Photo of ${pet.name}`,
              },
            ],
          }
        : undefined,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Pet Details',
      description: 'Find your new best friend',
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

// Get the pet's age in a friendly format
function getPetAge(age: number): string {
  if (age === 0) return 'Less than 1 year';
  return age === 1 ? '1 year old' : `${age} years old`;
}

// Get the pet's size in a friendly format
function getPetSizeText(size: string): string {
  const sizeMap: Record<string, string> = {
    'Pequeño': 'Small',
    'Mediano': 'Medium',
    'Grande': 'Large'
  };
  return sizeMap[size] || size;
}

// Get the pet's gender in a friendly format
function getPetGenderText(gender: string): string {
  const genderMap: Record<string, string> = {
    'Macho': 'Male',
    'Hembra': 'Female'
  };
  return genderMap[gender] || gender;
}

// Get the pet's type in a friendly format
function getPetTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    'perro': 'Dog',
    'gato': 'Cat',
    'otro': 'Other'
  };
  return typeMap[type] || type;
}

// Get the background color based on pet type
function getPetTypeColor(type: string): string {
  switch (type) {
    case 'perro':
      return 'bg-amber-50 dark:bg-amber-950/20';
    case 'gato':
      return 'bg-blue-50 dark:bg-blue-950/20';
    default:
      return 'bg-purple-50 dark:bg-purple-950/20';
  }
}

// Get the accent color based on pet type
function getPetTypeAccentColor(type: string): string {
  switch (type) {
    case 'perro':
      return 'text-amber-600 dark:text-amber-400';
    case 'gato':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-purple-600 dark:text-purple-400';
  }
}

// Get the status badge variant and className
function getPetStatusInfo(status: string): { 
  label: string, 
  className: string 
} {
  switch (status) {
    case 'disponible':
      return { 
        label: 'Available for Adoption', 
        className: 'bg-green-100 text-green-800 hover:bg-green-100' 
      };
    case 'en_proceso':
      return { 
        label: 'Adoption in Process',  
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' 
      };
    case 'adoptado':
      return { 
        label: 'Already Adopted',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
      };
    default:
      return { 
        label: status,
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' 
      };
  }
}

export default async function PetDetailPage({ params }: { params: PageParams }) {
  // Get the id using destructuring with Promise.resolve
  const { id } = await Promise.resolve(params);
  
  if (!id) {
    notFound();
  }
  
  try {
    const pet = await getPet(id);
    
    // If pet not found, show 404
    if (!pet) {
      notFound();
    }

    const typeColor = getPetTypeColor(pet.type);
    const accentColor = getPetTypeAccentColor(pet.type);
    const statusBadge = getPetStatusInfo(pet.status);
    const petAge = getPetAge(pet.age);
    const petSize = getPetSizeText(pet.size);
    const petGender = getPetGenderText(pet.gender);
    const petType = getPetTypeText(pet.type);
    
    return (
      <div className={`pb-16 ${typeColor}`}>
        {/* Back Button */}
        <div className="container py-4">
          <Button variant="ghost" size="sm" asChild className="group">
            <Link href="/pets" className="flex items-center gap-1 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Pets
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative w-full overflow-hidden bg-black/10">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: `url(${pet.image_url || DEFAULT_IMAGE_URL})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px)'
            }}
          />
          <div className="container relative z-20 pt-4 pb-6 md:pb-8 lg:pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
              {/* Main Pet Image */}
              <div className="lg:col-span-2">
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <PetImage 
                    pet={pet} 
                    priority 
                    containerClassName="aspect-[4/3] md:aspect-[16/9]"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 75vw"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1.5 text-xs font-medium shadow-md ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Pet Introduction */}
              <div className="flex flex-col justify-center">
                <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${accentColor}`}>
                  {pet.name}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-sm bg-background/80">
                    {petType}
                  </Badge>
                  <Badge variant="outline" className="text-sm bg-background/80">
                    {pet.breed}
                      </Badge>
                    </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{petAge}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4" />
                    <span>{petSize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {petGender === 'Male' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mars">
                        <circle cx="10" cy="14" r="5"/>
                        <path d="m17 3-3 3"/>
                        <path d="m14 6 3-3"/>
                        <path d="M14 3h3v3"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-venus">
                        <circle cx="12" cy="10" r="5"/>
                        <path d="M12 15v7"/>
                        <path d="M9 18h6"/>
                      </svg>
                    )}
                    <span>{petGender}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Adoption Center</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {pet.status === 'disponible' && (
                    <Button 
                      size="lg" 
                      className="rounded-full font-semibold shadow-md group"
                    >
                      <Link href={`/pets/${pet.id}/adopt`} className="flex items-center gap-2">
                        Adopt {pet.name}
                        <PawPrint className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full flex-1"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="sr-only">Favorite</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full flex-1"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="sr-only">Share</span>
                    </Button>
                    <PetOwnerActionsWrapper pet={pet} />
                  </div>
                </div>
              </div>
            </div>
          </div>
                </div>
                
        {/* Main Content */}
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-10">
              {/* Tabs for different sections */}
              <UITabs defaultValue="about" className="w-full">
                <UITabsList className="grid w-full grid-cols-3">
                  <UITabsTrigger value="about" className="text-sm">About</UITabsTrigger>
                  <UITabsTrigger value="details" className="text-sm">Details</UITabsTrigger>
                  <UITabsTrigger value="adoption" className="text-sm">Adoption Info</UITabsTrigger>
                </UITabsList>
                
                {/* About Tab */}
                <UITabsContent value="about" className="space-y-6 pt-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-4 ${accentColor}`}>Meet {pet.name}</h2>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {pet.description ? (
                        <p className="text-base leading-relaxed">{pet.description}</p>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-base leading-relaxed">
                            {pet.name} is a lovely {petGender.toLowerCase()} {pet.breed} looking for a forever home. 
                            {pet.age < 2 
                              ? ` Still young and playful, ${pet.name.toLowerCase()} has a lot of love to give.` 
                              : ` At ${pet.age} years old, ${pet.name.toLowerCase()} is ${pet.age > 7 ? 'mature' : 'active'} and ready to be part of your family.`
                            }
                          </p>
                          <p className="text-base leading-relaxed">
                            Every pet deserves a loving home. By adopting {pet.name}, you're not just getting a pet - you're gaining a loyal companion who will bring joy and love to your life for years to come.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Personality Traits */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Personality</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { trait: 'Friendly', value: 4 },
                        { trait: 'Playful', value: pet.age < 3 ? 5 : 3 },
                        { trait: 'Calm', value: pet.age > 5 ? 4 : 2 },
                        { trait: 'Good with kids', value: 3 },
                        { trait: 'Good with other pets', value: pet.type === 'gato' ? 2 : 4 },
                        { trait: 'Training', value: 3 }
                      ].map((item, index) => (
                        <div key={index} className="bg-background rounded-lg p-3 shadow-sm">
                          <p className="text-sm font-medium mb-1">{item.trait}</p>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-2 w-full rounded-full mr-0.5 ${
                                  i < item.value ? accentColor : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Why Adopt Section */}
                  <div className="bg-background rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Why Adopt {pet.name}?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <PawPrint className={`h-5 w-5 mt-0.5 ${accentColor}`} />
                        <span>You'll be giving a deserving pet a second chance at happiness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <PawPrint className={`h-5 w-5 mt-0.5 ${accentColor}`} />
                        <span>{pet.name} has been health-checked and is ready for a new home</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <PawPrint className={`h-5 w-5 mt-0.5 ${accentColor}`} />
                        <span>You'll receive ongoing support from our adoption team</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <PawPrint className={`h-5 w-5 mt-0.5 ${accentColor}`} />
                        <span>Adopting saves lives and helps combat pet overpopulation</span>
                      </li>
                    </ul>
                  </div>
                </UITabsContent>
                
                {/* Details Tab */}
                <UITabsContent value="details" className="space-y-6 pt-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-4 ${accentColor}`}>{pet.name}'s Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Basic Information */}
                      <Card>
                        <CardHeader>
                          <h3 className="text-lg font-semibold">Basic Information</h3>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <PetAttributes pet={pet} />
                        </CardContent>
                      </Card>
                      
                      {/* Additional Information */}
                      <Card>
                        <CardHeader>
                          <h3 className="text-lg font-semibold">Health & Care</h3>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div className="flex items-start gap-2">
                              <div className={`p-1.5 rounded-full ${accentColor} bg-background`}>
                                <Info className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Vaccinations</p>
                                <p className="text-sm text-muted-foreground">Up to date</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className={`p-1.5 rounded-full ${accentColor} bg-background`}>
                                <Info className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Spayed/Neutered</p>
                                <p className="text-sm text-muted-foreground">Yes</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className={`p-1.5 rounded-full ${accentColor} bg-background`}>
                                <Info className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Special Needs</p>
                                <p className="text-sm text-muted-foreground">None</p>
                              </div>
                            </div>
                          </div>
              </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`p-1.5 rounded-full ${accentColor} bg-background`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="w-0.5 bg-muted h-full my-1" />
                        </div>
                        <div>
                          <p className="font-medium">Arrival at Shelter</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(pet.created_at || Date.now()).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1">
                            {pet.name} arrived at our shelter and received initial health checks.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`p-1.5 rounded-full ${accentColor} bg-background`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="w-0.5 bg-muted h-full my-1" />
                        </div>
                        <div>
                          <p className="font-medium">Medical Evaluation</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(new Date(pet.created_at || Date.now()).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1">
                            Completed full medical evaluation and necessary treatments.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`p-1.5 rounded-full ${accentColor} bg-background`}>
                            <Clock className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Available for Adoption</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(new Date(pet.created_at || Date.now()).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1">
                            {pet.name} is now ready to find a forever home!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </UITabsContent>
                
                {/* Adoption Info Tab */}
                <UITabsContent value="adoption" className="space-y-6 pt-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-4 ${accentColor}`}>Adoption Process</h2>
                    <div className="space-y-8">
                      {/* Adoption Steps */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-background/50">
                          <CardHeader className="pb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                              <span className="font-bold text-primary">1</span>
                            </div>
                            <h3 className="font-semibold">Submit Application</h3>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Fill out our adoption application form with your details.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-background/50">
                          <CardHeader className="pb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                              <span className="font-bold text-primary">2</span>
                            </div>
                            <h3 className="font-semibold">Meet {pet.name}</h3>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Schedule a visit to meet {pet.name} in person and see if you're a match.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-background/50">
                          <CardHeader className="pb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                              <span className="font-bold text-primary">3</span>
                            </div>
                            <h3 className="font-semibold">Complete Adoption</h3>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Complete the paperwork, pay adoption fees, and welcome {pet.name} home!
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Adoption Fees */}
                      <Card>
                        <CardHeader>
                          <h3 className="text-lg font-semibold">Adoption Fees</h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4">
                            Adoption fees help cover the cost of care, including:
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>Vaccinations and medical treatments</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>Spaying/neutering</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>Microchipping</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>Food and shelter during their stay with us</span>
                            </li>
                          </ul>
                          <UISeparator className="my-4" />
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Standard adoption fee:</span>
                            <span className="font-bold text-lg">$150</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* FAQ */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-1">What's included in the adoption?</h4>
                            <p className="text-sm text-muted-foreground">
                              All pets come vaccinated, spayed/neutered, and microchipped. You'll also receive a starter pack with food samples and basic supplies.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Can I return a pet if it doesn't work out?</h4>
                            <p className="text-sm text-muted-foreground">
                              We have a 2-week adjustment period. If things don't work out, you can return the pet, but we encourage you to work with our behavioral specialists first.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">How long does the adoption process take?</h4>
                            <p className="text-sm text-muted-foreground">
                              Typically 3-5 days from application to taking your new pet home, depending on your availability for meet-and-greets.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </UITabsContent>
              </UITabs>
            </div>
            
            {/* Sidebar */}
            <div className="relative">
              <div className="md:sticky md:top-6 space-y-6">
                {/* Quick Action Card */}
                {pet.status === 'disponible' && (
                  <Card className="border-2 border-primary/20 shadow-md">
                    <CardHeader className="pb-2">
                      <h3 className="text-lg font-semibold">Ready to Adopt {pet.name}?</h3>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Start the adoption process today and give {pet.name} a loving home.
                      </p>
                      <Button className="w-full rounded-full" size="lg">
                        <Link href={`/pets/${pet.id}/adopt`} className="flex items-center gap-2">
                          Start Adoption Process
                        </Link>
                  </Button>
                    </CardContent>
                  </Card>
                )}
                
                {/* Contact Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Have Questions?</h3>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Contact us to learn more about {pet.name} or the adoption process.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contact Shelter
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Similar Pets */}
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Similar Pets</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <UIScrollArea className="h-72 w-full p-4">
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 group">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <div className="w-full h-full bg-muted" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate group-hover:text-primary">{pet.type === 'perro' ? 'Buddy' : 'Whiskers'} {i}</h4>
                              <p className="text-xs text-muted-foreground truncate">{pet.breed}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs px-1.5 py-0">
                                  {petAge}
                                </Badge>
                                <Badge variant="outline" className="text-xs px-1.5 py-0">
                                  {petGender}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </UIScrollArea>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link href="/pets">View all {petType.toLowerCase()}s</Link>
                    </Button>
              </CardFooter>
            </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering pet detail page:', error);
    throw error; // Let the nearest error boundary handle it
  }
} 