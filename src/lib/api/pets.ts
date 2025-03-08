import { supabase } from '@/lib/supabase';
import { Pet } from '@/types/pets';

export interface PetFilters {
  search?: string;
  type?: string;
  size?: string;
  gender?: string;
  status?: string;
  minAge?: string | number;
  maxAge?: string | number;
}

/**
 * Fetches pets from Supabase based on provided filters
 */
export async function fetchPets(filters: PetFilters = {}): Promise<Pet[]> {
  let query = supabase
    .from('pets')
    .select('*');
  
  // Apply text search filter
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,breed.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  
  // Apply categorical filters
  if (filters.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }
  
  if (filters.size && filters.size !== 'all') {
    query = query.eq('size', filters.size);
  }
  
  if (filters.gender && filters.gender !== 'all') {
    query = query.eq('gender', filters.gender);
  }
  
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  
  // Apply numeric range filters
  if (filters.minAge) {
    const minAge = typeof filters.minAge === 'string' ? parseInt(filters.minAge) : filters.minAge;
    if (!isNaN(minAge)) {
      query = query.gte('age', minAge);
    }
  }
  
  if (filters.maxAge) {
    const maxAge = typeof filters.maxAge === 'string' ? parseInt(filters.maxAge) : filters.maxAge;
    if (!isNaN(maxAge)) {
      query = query.lte('age', maxAge);
    }
  }
  
  // Order by most recent first
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
  
  return data as Pet[];
}

/**
 * Fetches a single pet by ID
 */
export async function fetchPetById(id: string): Promise<Pet | null> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found error code from Supabase
      return null;
    }
    console.error('Error fetching pet:', error);
    throw error;
  }
  
  return data as Pet;
} 