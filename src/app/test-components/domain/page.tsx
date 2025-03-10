/**
 * Domain Components Test Page
 * 
 * This page is used to test domain-specific components after migration to pure Tailwind CSS.
 */

import { PetList } from "@/components/pets/pet-list";
import { PetCard } from "@/components/pets/pet-card";
import { type Pet } from "@/types/pets";

export default function DomainComponentsTestPage() {
  // Sample pet data for testing
  const samplePets: Pet[] = [
    {
      id: "1",
      name: "Max",
      type: "dog",
      breed: "Golden Retriever",
      age: 3,
      size: "large",
      gender: "male",
      description: "Friendly and playful golden retriever, loves to run and play fetch. Great with kids and other pets.",
      images: ["/samples/dog1.jpg"],
      location: "Madrid",
      status: "available",
      owner: {
        id: "user1",
        name: "John Doe",
        email: "john@example.com"
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      name: "Luna",
      type: "cat",
      breed: "Siamese",
      age: 2,
      size: "medium",
      gender: "female",
      description: "Elegant and calm Siamese cat, very affectionate with her owners. Prefers quiet environments.",
      images: ["/samples/cat1.jpg"],
      location: "Barcelona",
      status: "available",
      owner: {
        id: "user2",
        name: "Jane Smith",
        email: "jane@example.com"
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "3",
      name: "Rocky",
      type: "dog",
      breed: "Bulldog",
      age: 5,
      size: "medium",
      gender: "male",
      description: "Loyal and friendly bulldog, loves to relax and be lazy. Excellent watchdog with a heart of gold.",
      images: ["/samples/dog2.jpg"],
      location: "Valencia",
      status: "available",
      owner: {
        id: "user3",
        name: "Carlos Rodriguez",
        email: "carlos@example.com"
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Sample pet with adopted status
  const adoptedPet: Pet = {
    id: "4",
    name: "Coco",
    type: "dog",
    breed: "Beagle",
    age: 1,
    size: "small",
    gender: "female",
    description: "Energetic and sweet beagle puppy, already found her forever home!",
    images: ["/samples/dog3.jpg"],
    location: "Sevilla",
    status: "adopted",
    owner: {
      id: "user4",
      name: "Maria Lopez",
      email: "maria@example.com"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Domain Component Tests</h1>
      
      {/* PetCard Component Tests */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">PetCard Component</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Vertical Layout (Default):</h3>
          <div className="border p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <PetCard pet={samplePets[0]} />
              <PetCard pet={adoptedPet} />
              <PetCard pet={{} as Pet} isLoading={true} />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Horizontal Layout:</h3>
          <div className="border p-6 rounded-lg">
            <div className="space-y-4">
              <PetCard pet={samplePets[1]} layout="horizontal" />
              <PetCard pet={adoptedPet} layout="horizontal" />
              <PetCard pet={{} as Pet} layout="horizontal" isLoading={true} />
            </div>
          </div>
        </div>
      </section>
      
      {/* PetList Component Test */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">PetList Component</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">With Pets:</h3>
          <div className="border p-6 rounded-lg">
            <PetList pets={samplePets} title="Available Pets" />
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Loading State:</h3>
          <div className="border p-6 rounded-lg">
            <PetList pets={[]} isLoading={true} title="Loading Pets" />
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Empty State:</h3>
          <div className="border p-6 rounded-lg">
            <PetList 
              pets={[]} 
              emptyMessage="No pets matching your search criteria. Try adjusting your filters." 
              title="Search Results" 
            />
          </div>
        </div>
      </section>
    </div>
  );
} 