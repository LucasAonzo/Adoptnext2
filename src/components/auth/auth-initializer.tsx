'use client';

import { useEffect, useState, useRef } from 'react';
import { initializeAuth, useAuthStore, logAuthState } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function AuthInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttempted = useRef(false);
  const storeInitialized = useAuthStore((state) => state.initialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const signOut = useAuthStore((state) => state.signOut);
  const router = useRouter();

  // Function to log all cookies for debugging
  const logCookies = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim());
      console.log('AuthInitializer - All cookies:', cookies);
      
      // Check for auth cookies
      const authCookies = cookies.filter(c => 
        c.startsWith('sb-') && c.includes('-auth-token')
      );
      
      console.log('AuthInitializer - Auth cookies found:', authCookies);
      
      // Extract Supabase project reference from environment variable
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
      const projectRef = projectRefMatch ? projectRefMatch[1] : 'lwtrjbglrdehtwaxunop';
      
      console.log('AuthInitializer - Expected cookie prefix:', `sb-${projectRef}-auth-token`);
      
      // Check if we have the correct project cookie
      const hasCorrectProjectCookie = authCookies.some(c => c.startsWith(`sb-${projectRef}-auth-token`));
      console.log('AuthInitializer - Has correct project cookie:', hasCorrectProjectCookie);
    }
  };

  useEffect(() => {
    // Only initialize if not already initialized and not attempted before
    if (!storeInitialized && !isInitialized && !initializationAttempted.current) {
      initializationAttempted.current = true;
      
      let cleanup: (() => void) | undefined;
      
      const initialize = async () => {
        try {
          // Extract Supabase project reference from environment variable
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
          const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
          const projectRef = projectRefMatch ? projectRefMatch[1] : 'lwtrjbglrdehtwaxunop';
          
          console.log('AuthInitializer - Using Supabase project reference:', projectRef);
          
          // Log all cookies before initialization
          logCookies();
          
          // First check if there's a session directly with Supabase
          const { data: sessionData } = await supabase.auth.getSession();
          console.log('AuthInitializer - Direct Supabase session check:', 
            sessionData.session ? 'Session exists' : 'No session');
          
          if (sessionData.session) {
            console.log('AuthInitializer - User from session:', sessionData.session.user.email);
            
            // Force a session refresh to ensure cookies are set
            console.log('AuthInitializer - Forcing session refresh to ensure cookies are set');
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
              console.error('AuthInitializer - Error refreshing session:', refreshError);
            } else if (refreshData.session) {
              console.log('AuthInitializer - Session refreshed successfully');
            }
            
            // Log cookies after refresh
            setTimeout(() => {
              console.log('AuthInitializer - Cookies after refresh:');
              logCookies();
            }, 500);
          }
          
          // Check for cookie mismatch
          const cookies = document.cookie.split(';').map(c => c.trim());
          const authCookies = cookies.filter(c => 
            c.startsWith('sb-') && c.includes('-auth-token')
          );
          
          console.log('AuthInitializer - Auth cookies found:', authCookies);
          
          // Check if we have auth cookies for a different project
          const hasCorrectProjectCookie = authCookies.some(c => c.startsWith(`sb-${projectRef}-auth-token`));
          const hasDifferentProjectCookie = authCookies.some(c => 
            c.startsWith('sb-') && 
            c.includes('-auth-token') && 
            !c.startsWith(`sb-${projectRef}-auth-token`)
          );
          
          console.log('AuthInitializer - Cookie check:', {
            hasCorrectProjectCookie,
            hasDifferentProjectCookie,
            authCookies
          });
          
          // If we have cookies for a different project but not for the current project,
          // we need to sign out and clear cookies
          if (hasDifferentProjectCookie && !hasCorrectProjectCookie) {
            console.log('AuthInitializer - Cookie mismatch detected, signing out and clearing cookies');
            
            // Show a toast to inform the user
            toast.error(
              'Authentication error: You appear to be signed in to a different project. Please sign in again.',
              { duration: 5000 }
            );
            
            // Sign out to clear the session
            await supabase.auth.signOut();
            
            // Clear all auth cookies
            authCookies.forEach(cookie => {
              const cookieName = cookie.split('=')[0];
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              console.log(`Cleared cookie: ${cookieName}`);
            });
            
            // Redirect to auth page
            setTimeout(() => {
              router.push('/auth');
            }, 1000);
            
            return;
          }
          
          // Initialize the auth store
          cleanup = await initializeAuth();
          setIsInitialized(true);
          
          // Force a session refresh to ensure the store is in sync with Supabase
          await refreshSession();
          
          // Log auth state after initialization
          logAuthState();
          
          // Log cookies after initialization
          setTimeout(() => {
            console.log('AuthInitializer - Cookies after initialization:');
            logCookies();
          }, 500);
          
          // Set up a periodic session refresh
          const refreshInterval = setInterval(() => {
            refreshSession().catch(err => {
              console.error('Error refreshing session:', err);
            });
          }, 5 * 60 * 1000); // Refresh every 5 minutes
          
          // Clean up the interval on unmount
          const originalCleanup = cleanup;
          cleanup = () => {
            clearInterval(refreshInterval);
            if (originalCleanup) {
              originalCleanup();
            }
          };
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
  }, [storeInitialized, isInitialized, refreshSession, router, signOut]);

  // Log auth state changes
  useEffect(() => {
    if (isInitialized) {
      console.log('AuthInitializer - Auth state changed:', { 
        isAuthenticated, 
        hasUser: !!user 
      });
      
      // Log cookies when auth state changes
      logCookies();
    }
  }, [isAuthenticated, user, isInitialized]);

  return null; // This component doesn't render anything
} 