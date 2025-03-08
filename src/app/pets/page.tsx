'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PetCard } from '@/components/pets/pet-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, Grid3X3, List } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPets } from '@/lib/api/pets';
import { Pet, FilterState } from '@/types/pets';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';

export default function PetsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Get initial filter values from URL
  const initialFilters: FilterState = {
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'all',
    size: searchParams.get('size') || 'all',
    gender: searchParams.get('gender') || 'all',
    status: searchParams.get('status') || 'disponible', // Default to available pets
    minAge: searchParams.get('minAge') || '',
    maxAge: searchParams.get('maxAge') || '',
  };
  
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Use React Query for data fetching with our API layer
  const { data: pets = [], isLoading, isError } = useQuery({
    queryKey: ['pets', filters],
    queryFn: () => fetchPets(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Update URL when filters change
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters.size && filters.size !== 'all') params.set('size', filters.size);
    if (filters.gender && filters.gender !== 'all') params.set('gender', filters.gender);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.minAge) params.set('minAge', filters.minAge);
    if (filters.maxAge) params.set('maxAge', filters.maxAge);
    
    const url = `/pets${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url, { scroll: false });
  }, [filters, router]);
  
  // Update URL on filter change
  useEffect(() => {
    updateUrl();
  }, [filters, updateUrl]);
  
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      size: 'all',
      gender: 'all',
      status: 'disponible',
      minAge: '',
      maxAge: '',
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already updated via handleFilterChange
  };
  
  const handlePublishPet = () => {
    if (isAuthenticated) {
      router.push('/pets/publish');
    } else {
      toast.error('You must be logged in to publish a pet');
      router.push('/auth?redirect=/pets/publish');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Find Your Perfect Companion</h1>
          <p className="text-muted-foreground mt-2">Browse our selection of loving pets waiting for a home</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            onClick={handlePublishPet}
            className="flex items-center gap-2"
          >
            Publish Pet
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <div className="flex bg-muted rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-2"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-2"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className={`${showFilters ? 'block' : 'hidden md:block'} w-full md:w-64 lg:w-72 space-y-4 mb-6 md:mb-0`}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
              <CardDescription>Narrow down your search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium">Search</label>
                  <div className="flex">
                    <Input
                      id="search"
                      placeholder="Search by name, breed..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="petType" className="text-sm font-medium">Pet Type</label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange('type', value)}
                  >
                    <SelectTrigger id="petType">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="perro">Dogs</SelectItem>
                      <SelectItem value="gato">Cats</SelectItem>
                      <SelectItem value="otro">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="size" className="text-sm font-medium">Size</label>
                  <Select
                    value={filters.size}
                    onValueChange={(value) => handleFilterChange('size', value)}
                  >
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any size</SelectItem>
                      <SelectItem value="Pequeño">Small</SelectItem>
                      <SelectItem value="Mediano">Medium</SelectItem>
                      <SelectItem value="Grande">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                  <Select
                    value={filters.gender}
                    onValueChange={(value) => handleFilterChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Any gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any gender</SelectItem>
                      <SelectItem value="Macho">Male</SelectItem>
                      <SelectItem value="Hembra">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Available</SelectItem>
                      <SelectItem value="en_proceso">In Process</SelectItem>
                      <SelectItem value="adoptado">Adopted</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label htmlFor="minAge" className="text-sm font-medium">Min Age</label>
                    <Input
                      id="minAge"
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={filters.minAge}
                      onChange={(e) => handleFilterChange('minAge', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="maxAge" className="text-sm font-medium">Max Age</label>
                    <Input
                      id="maxAge"
                      type="number"
                      placeholder="Max"
                      min="0"
                      value={filters.maxAge}
                      onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Apply Filters</Button>
              </form>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-6"
            }>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[400px]">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-red-600">Error loading pets</h3>
              <p className="text-muted-foreground mt-2">Please try again later</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : pets.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-4">Showing {pets.length} results</p>
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-6"
              }>
                {pets.map((pet) => (
                  <PetCard 
                    key={pet.id} 
                    pet={pet as any} 
                    layout={viewMode === 'list' ? 'horizontal' : 'vertical'} 
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No pets found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters to find more pets</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 