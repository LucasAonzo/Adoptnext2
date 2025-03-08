'use client';

import React, { ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useAuthStore, useUser, useSession, useIsAuthenticated, useIsLoading } from '../stores/auth-store';

// Define the shape of our auth context (for backward compatibility)
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

// Create a dummy context (not actually used)
const AuthContext = React.createContext<AuthContextType | null>(null);

// Hook to use the auth context (redirects to Zustand store)
export const useAuth = () => {
  const user = useUser();
  const session = useSession();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();
  const { signIn, signUp, signOut, refreshSession, resetPassword } = useAuthStore();
  
  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshSession,
    resetPassword
  };
};

// Auth provider component (for backward compatibility)
export function AuthProvider({ children }: { children: ReactNode }) {
  // This is now just a pass-through component
  return <>{children}</>;
} 