'use client';

import { useEffect, useState, useRef } from 'react';
import { initializeAuth, useAuthStore, logAuthState } from '@/lib/stores/auth-store';

export function AuthInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttempted = useRef(false);
  const storeInitialized = useAuthStore((state) => state.initialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Only initialize if not already initialized and not attempted before
    if (!storeInitialized && !isInitialized && !initializationAttempted.current) {
      initializationAttempted.current = true;
      
      let cleanup: (() => void) | undefined;
      
      const initialize = async () => {
        try {
          cleanup = await initializeAuth();
          setIsInitialized(true);
          
          // Log auth state after initialization
          logAuthState();
        } catch (error) {
          console.error('Error initializing auth from AuthInitializer:', error);
          setIsInitialized(true); // Mark as initialized anyway to prevent infinite attempts
        }
      };
      
      initialize();
      
      return () => {
        if (cleanup) {
          cleanup();
        }
      };
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [storeInitialized, isInitialized, isAuthenticated, user]);

  // Log auth state changes
  useEffect(() => {
    // No need to log auth state changes
  }, [isAuthenticated, user, isInitialized]);

  return null; // This component doesn't render anything
} 