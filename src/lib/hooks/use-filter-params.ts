'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { debounce } from '../utils';

interface FilterOptions<T extends Record<string, any>> {
  /**
   * Default values for filters
   */
  defaultValues: T;
  
  /**
   * Callback when filters change
   */
  onChange?: (filters: T) => void;
  
  /**
   * Debounce time in ms for URL updates
   */
  debounceMs?: number;
  
  /**
   * Whether to push to history or replace
   */
  replace?: boolean;
  
  /**
   * Whether to scroll to top on filter change
   */
  scroll?: boolean;
  
  /**
   * Serializers for converting filter values to strings for URL
   */
  serializers?: Partial<{
    [K in keyof T]: (value: T[K]) => string;
  }>;
  
  /**
   * Deserializers for converting URL strings to filter values
   */
  deserializers?: Partial<{
    [K in keyof T]: (value: string) => T[K];
  }>;
}

/**
 * A hook for managing filter state in the URL.
 * 
 * @example
 * ```tsx
 * const { filters, setFilter, resetFilters } = useFilterParams<PetFilters>({
 *   defaultValues: {
 *     search: '',
 *     type: 'all',
 *     status: 'disponible',
 *   }
 * });
 * ```
 */
export function useFilterParams<T extends Record<string, any>>(options: FilterOptions<T>) {
  const {
    defaultValues,
    onChange,
    debounceMs = 300,
    replace = false,
    scroll = false,
    serializers = {},
    deserializers = {},
  } = options;
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL or default values
  const [filters, setFilters] = useState<T>(() => {
    const initialFilters = { ...defaultValues };
    
    // For each filter, try to get from URL
    Object.keys(defaultValues).forEach((key) => {
      const paramValue = searchParams.get(key);
      if (paramValue !== null) {
        // Use deserializer if available, otherwise use string value
        const deserializer = deserializers[key as keyof T];
        if (deserializer) {
          initialFilters[key as keyof T] = deserializer(paramValue);
        } else {
          initialFilters[key as keyof T] = paramValue as any;
        }
      }
    });
    
    return initialFilters;
  });
  
  // Update the URL when filters change
  const updateUrl = useCallback(
    debounce((newFilters: T) => {
      // Start with a new URLSearchParams
      const params = new URLSearchParams();
      
      // For each filter, add to params if not default value
      Object.entries(newFilters).forEach(([key, value]) => {
        // Skip empty or default values
        if (
          value === undefined || 
          value === null || 
          value === '' || 
          value === defaultValues[key]
        ) {
          return;
        }
        
        // Use serializer if available, otherwise use string value
        const serializer = serializers[key as keyof T];
        const paramValue = serializer 
          ? serializer(value) 
          : String(value);
        
        params.set(key, paramValue);
      });
      
      // Create the URL
      const url = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      
      // Update the URL
      if (replace) {
        router.replace(url, { scroll });
      } else {
        router.push(url, { scroll });
      }
    }, debounceMs),
    [pathname, router, replace, scroll, serializers, defaultValues, debounceMs]
  );
  
  // Set a single filter value
  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      
      // Call onChange if provided
      if (onChange) {
        onChange(newFilters);
      }
      
      return newFilters;
    });
  }, [onChange]);
  
  // Reset all filters to default values
  const resetFilters = useCallback(() => {
    setFilters(defaultValues);
    
    // Call onChange if provided
    if (onChange) {
      onChange(defaultValues);
    }
  }, [defaultValues, onChange]);
  
  // Update URL when filters change
  useEffect(() => {
    updateUrl(filters);
  }, [filters, updateUrl]);
  
  return {
    /**
     * The current filter values
     */
    filters,
    
    /**
     * Set a single filter value
     */
    setFilter,
    
    /**
     * Reset all filters to default values
     */
    resetFilters,
    
    /**
     * Check if filters are at default values
     */
    isDefault: JSON.stringify(filters) === JSON.stringify(defaultValues),
  };
} 