import { Pet } from '@/types/pets';
import { supabase } from './supabase';
import { useQuery } from '@tanstack/react-query';

export const api = {
  pets: {
    list: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Pet[];
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Pet;
    },
    getByStatus: async (status: Pet['status']) => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Pet[];
    },
  },
};

// React Query hooks
export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: () => api.pets.list(),
  });
}

export function usePet(id: string) {
  return useQuery({
    queryKey: ['pet', id],
    queryFn: () => api.pets.getById(id),
    enabled: !!id,
  });
}

export function useAvailablePets() {
  return useQuery({
    queryKey: ['pets', 'available'],
    queryFn: () => api.pets.getByStatus('disponible'),
  });
} 