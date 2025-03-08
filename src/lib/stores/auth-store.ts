import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';

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

  // Actions
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
  
  // Internal actions (not typically called directly by components)
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setInitialized: (initialized: boolean) => void;
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
      // Create Supabase client
      const supabase = createClientComponentClient();
      
      return {
        // Initial state
        user: null,
        session: null,
        isLoading: true,
        isAuthenticated: false,
        initialized: false,
        forceUpdate: 0,
        
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
        
        // Handle auth state changes
        handleAuthChange: (event, session) => {
          const currentState = get();
          const timestamp = getTimestamp();
          
          if (event === 'SIGNED_IN') {
            // Store the SIGNED_IN timestamp in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(LAST_SIGNED_IN_KEY, Date.now().toString());
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
              forceUpdate: currentState.forceUpdate + 1
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
              forceUpdate: currentState.forceUpdate + 1
            };
            
            set(newState);
            syncLocalStorage({
              user: newState.user,
              session: newState.session,
              isAuthenticated: newState.isAuthenticated
            });
          }
        },
        
        // Refresh session
        refreshSession: async () => {
          try {
            set({ isLoading: true });
            
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('Error refreshing session:', error);
              return;
            }
            
            const currentState = get();
            
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
              forceUpdate: currentState.forceUpdate + 1
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
        
        // Sign in - MODIFIED: Don't update state here, let auth state change listener handle it
        signIn: async (email, password) => {
          try {
            set({ isLoading: true });
            
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            // Force a sync with localStorage if sign-in was successful
            if (!error && data.session) {
              // Store the SIGNED_IN timestamp in localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem(LAST_SIGNED_IN_KEY, Date.now().toString());
              }
              
              // Only sync the session to localStorage, don't update the state
              syncLocalStorage({
                session: data.session
              });
            }
            
            return { error };
          } catch (error) {
            console.error('Error signing in:', error);
            return { error: error as AuthError };
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Sign up
        signUp: async (email, password) => {
          try {
            set({ isLoading: true });
            
            const { data, error } = await supabase.auth.signUp({
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
            await supabase.auth.signOut();
            
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
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
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