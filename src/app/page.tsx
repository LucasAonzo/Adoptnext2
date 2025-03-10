import { supabase } from "@/lib/supabase"
import type { Pet } from "@/types/pets"
import { Skeleton } from "@/components/ui/skeleton"
import { HeroSection } from "@/components/sections/hero-section"
import { PetListingsSection } from "@/components/sections/pet-listings-section"

/**
 * Fetches pets from the database
 * @returns {Promise<Pet[]>} List of pets
 */
async function getPets() {
  const { data, error } = await supabase.from("pets").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data as Pet[]
}

export default async function Home() {
  const pets = await getPets()

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <PetListingsSection pets={pets} />
    </main>
  )
}

// Loading state
export function Loading() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden shadow bg-card">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

