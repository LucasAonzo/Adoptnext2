import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, createBrowserClient, checkAuthCookies, clearAllAuthCookies } from '@/lib/supabase';

// Flag to track if auth has been initialized
let authInitialized = false;

// Constants
const LAST_SIGNED_IN_KEY = 'last_signed_in_timestamp';
const RECENT_SIGN_IN_THRESHOLD = 10000; // 10 seconds

// Define the auth state interface
interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  forceUpdate: number; // Counter to force UI updates
  cookieMismatch: boolean; // Flag to detect cookie/session mismatch

  // Actions
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
  checkAndFixAuth: () => Promise<boolean>; // New method to fix auth issues
  
  // Internal actions (not typically called directly by components)
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setCookieMismatch: (mismatch: boolean) => void;
  handleAuthChange: (event: AuthChangeEvent, session: Session | null) => void;
}

// Function to get current timestamp
const getTimestamp = () => new Date().toISOString();

// Function to synchronize localStorage with current state
const syncLocalStorage = (state: Partial<Pick<AuthState, 'user' | 'session' | 'isAuthenticated'>>) => {
  if (typeof window !== 'undefined') {
    try {
      const timestamp = getTimestamp();
      const beforeStorage = localStorage.getItem('auth-storage');
      
      const currentStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      const updatedStorage = {
        ...currentStorage,
        state: {
          ...currentStorage.state,
          ...state
        }
      };
      localStorage.setItem('auth-storage', JSON.stringify(updatedStorage));
    } catch (error) {
      console.error('Error synchronizing localStorage:', error);
    }
  }
};

// Create the auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Create a client for browser usage
      const clientSupabase = typeof window !== 'undefined' ? createBrowserClient() : supabase;
      
      return {
        // Initial state
        user: null,
        session: null,
        isLoading: true,
        isAuthenticated: false,
        initialized: false,
        forceUpdate: 0,
        cookieMismatch: false,
        
        // Set state actions
        setUser: (user) => {
          set({ user });
          syncLocalStorage({ user });
        },
        setSession: (session) => {
          set({ session });
          syncLocalStorage({ session });
        },
        setLoading: (isLoading) => {
          set({ isLoading });
        },
        setAuthenticated: (isAuthenticated) => {
          set({ isAuthenticated });
          syncLocalStorage({ isAuthenticated });
        },
        setInitialized: (initialized) => {
          set({ initialized });
        },
        setCookieMismatch: (cookieMismatch) => {
          set({ cookieMismatch });
        },
        
        // Handle auth state changes
        handleAuthChange: (event, session) => {
          console.log('Auth state change:', event, session?.user?.email || 'No user');
          const currentState = get();
          const timestamp = getTimestamp();
          
          if (event === 'SIGNED_IN') {
            // Store the SIGNED_IN timestamp in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(LAST_SIGNED_IN_KEY, Date.now().toString());
            }
            
            // Check if auth cookies exist
            const authCookies = checkAuthCookies();
            if (authCookies.length === 0) {
              console.warn('SIGNED_IN event but no auth cookies found - possible cookie issue');
              set({ cookieMismatch: true });
            } else {
              set({ cookieMismatch: false });
            }
          }
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Always set isAuthenticated to true for SIGNED_IN events
            const newState = {
              user: session?.user || null,
              session,
              isAuthenticated: true, // Force to true regardless of session.user
              isLoading: false,
              forceUpdate: currentState.forceUpdate + 1
            };
            set(newState);
            syncLocalStorage({
              user: newState.user,
              session: newState.session,
              isAuthenticated: newState.isAuthenticated
            });
          } else if (event === 'SIGNED_OUT') {
            const newState = {
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
              forceUpdate: currentState.forceUpdate + 1,
              cookieMismatch: false
            };
            set(newState);
            syncLocalStorage({
              user: newState.user,
              session: newState.session,
              isAuthenticated: newState.isAuthenticated
            });
            
            // Clear the SIGNED_IN timestamp
            if (typeof window !== 'undefined') {
              localStorage.removeItem(LAST_SIGNED_IN_KEY);
            }
          } else if (event === 'INITIAL_SESSION') {
            // On initial session, check for auth cookies
            const authCookies = checkAuthCookies();
            const hasCookies = authCookies.length > 0;
            const hasSession = !!session?.user;
            
            // Detect potential cookie/session mismatch
            const mismatch = hasCookies && !hasSession;
            
            if (mismatch) {
              console.warn('Cookie/session mismatch detected: cookies exist but no session found');
            }
            
            // Check if we had a recent SIGNED_IN event
            const lastSignedInTime = typeof window !== 'undefined' ? 
              localStorage.getItem(LAST_SIGNED_IN_KEY) : null;
            
            const isRecentSignIn = lastSignedInTime && 
              (Date.now() - parseInt(lastSignedInTime, 10) < RECENT_SIGN_IN_THRESHOLD);
            
            let newIsAuthenticated = false;
            
            if (session?.user) {
              // If session has a user, always authenticate
              newIsAuthenticated = true;
            } else if (currentState.isAuthenticated) {
              // If already authenticated, preserve that state
              newIsAuthenticated = true;
            } else if (isRecentSignIn) {
              // If recent sign-in, force authenticated
              newIsAuthenticated = true;
            } else {
              // Otherwise, not authenticated
              newIsAuthenticated = false;
            }
            
            const newState = {
              // Preserve existing user/session if new session doesn't have a user
              user: session?.user || currentState.user,
              session: session?.user ? session : currentState.session,
              isAuthenticated: newIsAuthenticated,
              isLoading: false,
              initialized: true,
              forceUpdate: currentState.forceUpdate + 1,
              cookieMismatch: mismatch
            };
            
            set(newState);
            syncLocalStorage({
              user: newState.user,
              session: newState.session,
              isAuthenticated: newState.isAuthenticated
            });
          }
        },
        
        // Check and fix auth issues
        checkAndFixAuth: async () => {
          try {
            set({ isLoading: true });
            console.log('Checking and fixing auth state...');
            
            // 1. Check cookies and session state
            const authCookies = checkAuthCookies();
            console.log('Auth cookies found:', authCookies);
            
            const { data, error } = await clientSupabase.auth.getSession();
            console.log('Session check result:', { 
              hasSession: !!data.session, 
              hasUser: !!data.session?.user,
              error: error?.message || null 
            });
            
            if (data.session?.user) {
              // Session is valid, update store and return
              set({ 
                session: data.session,
                user: data.session.user,
                isAuthenticated: true,
                isLoading: false,
                cookieMismatch: false
              });
              return true;
            }
            
            if (authCookies.length > 0 && !data.session) {
              // Cookie/session mismatch detected
              console.log('Cookie/session mismatch detected, attempting to fix...');
              set({ cookieMismatch: true });
              
              // Clear all auth cookies to avoid stale data
              clearAllAuthCookies();
              
              // Try to refresh the session
              const refreshResult = await clientSupabase.auth.refreshSession();
              console.log('Session refresh result:', {
                success: !!refreshResult.data.session,
                error: refreshResult.error?.message || null
              });
              
              if (refreshResult.data.session) {
                // Session refresh worked, update store and return
                set({
                  session: refreshResult.data.session,
                  user: refreshResult.data.session.user,
                  isAuthenticated: true,
                  isLoading: false,
                  cookieMismatch: false
                });
                return true;
              }
              
              // If refresh failed, we're truly not authenticated
              set({
                session: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                cookieMismatch: false
              });
              return false;
            }
            
            // No cookies and no session = not authenticated
            if (authCookies.length === 0 && !data.session) {
              set({
                session: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                cookieMismatch: false
              });
              return false;
            }
            
            return !!data.session;
          } catch (error) {
            console.error('Error checking auth state:', error);
            return false;
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Refresh session
        refreshSession: async () => {
          try {
            set({ isLoading: true });
            
            const { data, error } = await clientSupabase.auth.getSession();
            
            if (error) {
              console.error('Error refreshing session:', error);
              return;
            }
            
            const currentState = get();
            
            // Check for cookie/session mismatches
            const authCookies = checkAuthCookies();
            const hasCookies = authCookies.length > 0;
            const hasSession = !!data.session?.user;
            const mismatch = hasCookies && !hasSession;
            
            // Determine new authentication state:
            // 1. If session has a user, set to true
            // 2. If already authenticated, preserve that state
            let newIsAuthenticated = false;
            
            if (data.session?.user) {
              newIsAuthenticated = true;
            } else if (currentState.isAuthenticated) {
              newIsAuthenticated = true;
            } else {
              newIsAuthenticated = false;
            }
            
            const newState = {
              user: data.session?.user || currentState.user,
              session: data.session || currentState.session,
              isAuthenticated: newIsAuthenticated,
              isLoading: false,
              forceUpdate: currentState.forceUpdate + 1,
              cookieMismatch: mismatch
            };
            
            set(newState);
            syncLocalStorage({
              user: newState.user,
              session: newState.session,
              isAuthenticated: newState.isAuthenticated
            });
          } catch (error) {
            console.error('Unexpected error refreshing session:', error);
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Sign in
        signIn: async (email, password) => {
          try {
            set({ isLoading: true });
            
            // First clear any existing auth cookies
            clearAllAuthCookies();
            
            const { data, error } = await clientSupabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (!error && data.session) {
              // Store the SIGNED_IN timestamp in localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem(LAST_SIGNED_IN_KEY, Date.now().toString());
              }
              
              // Check if auth cookies exist
              const authCookies = checkAuthCookies();
              const cookieMismatch = authCookies.length === 0;
              
              if (cookieMismatch) {
                console.warn('Sign-in successful but no auth cookies found - possible cookie issue');
              }
              
              set({
                user: data.session.user,
                session: data.session,
                isAuthenticated: true,
                cookieMismatch
              });
            }
            
            return { error };
          } catch (error) {
            console.error('Unexpected error in signIn:', error);
            return { error: { message: 'Unexpected error occurred' } as AuthError };
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Sign up
        signUp: async (email, password) => {
          try {
            set({ isLoading: true });
            
            const { data, error } = await clientSupabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
              }
            });
            
            return { error };
          } catch (error) {
            console.error('Error signing up:', error);
            return { error: error as AuthError };
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Sign out
        signOut: async () => {
          try {
            await clientSupabase.auth.signOut();
            
            // Clear the SIGNED_IN timestamp
            if (typeof window !== 'undefined') {
              localStorage.removeItem(LAST_SIGNED_IN_KEY);
            }
          } catch (error) {
            console.error('Error signing out:', error);
          }
        },
        
        // Reset password
        resetPassword: async (email) => {
          try {
            const { error } = await clientSupabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/auth/reset-password/confirm`
            });
            
            return { error };
          } catch (error) {
            console.error('Error resetting password:', error);
            return { error: error as AuthError };
          }
        }
      };
    },
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        forceUpdate: state.forceUpdate
      }),
      // Add onRehydrateStorage to handle rehydration
      onRehydrateStorage: () => (state) => {
      }
    }
  )
);

// Debug function to log current auth state
export const logAuthState = () => {
  const state = useAuthStore.getState();
  return state;
};

// Initialize auth state and set up listeners
export const initializeAuth = async () => {
  // Prevent multiple initializations
  if (authInitialized) {
    return () => {}; // Return empty cleanup function
  }
  
  const { handleAuthChange, setInitialized, refreshSession } = useAuthStore.getState();
  
  try {
    authInitialized = true; // Mark as initialized immediately
    
    // Get initial session
    await refreshSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = createClientComponentClient().auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(event, session);
      }
    );
    
    // Clean up function
    const cleanup = () => {
      subscription.unsubscribe();
      authInitialized = false; // Reset flag on cleanup
    };
    
    // Add cleanup to window for client-side cleanup - Fixed the TypeScript error
    if (typeof window !== 'undefined') {
      const previous = window.onbeforeunload;
      window.onbeforeunload = function(e: BeforeUnloadEvent) {
        cleanup();
        if (previous) {
          return previous.call(window, e);
        }
        return undefined;
      };
    }
    
    setInitialized(true);
    
    return cleanup;
  } catch (error) {
    setInitialized(true); // Still mark as initialized to prevent infinite loading
    return () => {
      authInitialized = false; // Reset flag on cleanup
    };
  }
};

// Hook to ensure auth is initialized
export const useAuthInitialized = () => {
  const initialized = useAuthStore((state) => state.initialized);
  return initialized;
};

// Convenience hooks for common auth state
export const useUser = () => useAuthStore((state) => state.user);
export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useForceUpdate = () => useAuthStore((state) => state.forceUpdate); 