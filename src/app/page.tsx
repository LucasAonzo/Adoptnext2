import { PetList } from '@/components/pets/pet-list';
import { supabase } from '@/lib/supabase';
import { type Pet } from '@/types/pets';
import { Skeleton } from '@/components/ui/skeleton';

async function getPets() {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Pet[];
}

export default async function Home() {
  const pets = await getPets();

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Pets</h1>
        <p className="text-muted-foreground">
          Find your new best friend among our lovely pets waiting for a home.
        </p>
      </div>
      
      <PetList pets={pets} />
    </div>
  );
}

// Loading state
export function Loading() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
