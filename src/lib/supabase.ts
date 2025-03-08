import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { type CookieOptions } from '@supabase/ssr';
import { type Pet } from '@/types/pets';

// Environment variables for Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Parse project reference from URL for cookie naming
const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
export const projectRef = projectRefMatch ? projectRefMatch[1] : '';
export const authCookieName = `sb-${projectRef}-auth-token`;

// Standard cookie settings for consistency
export const DEFAULT_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

// Create a standard client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Create browser client that works in client components
export const createBrowserClient = () => {
  return createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
};

// Debug function to check all auth cookies
export function checkAuthCookies(): string[] {
  if (typeof window === 'undefined') return [];
  
  return document.cookie
    .split('; ')
    .filter(row => row.startsWith('sb-') && row.includes('-auth-token'))
    .map(cookie => cookie.split('=')[0]);
}

// Helper to clear all auth cookies
export function clearAllAuthCookies() {
  if (typeof window === 'undefined') return;
  
  const authCookies = checkAuthCookies();
  authCookies.forEach(name => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    console.log(`Cleared auth cookie: ${name}`);
  });
}

// Export authentication helpers for consistent usage
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  // Clear all cookies before signing out to avoid stale cookies
  clearAllAuthCookies();
  return supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({
    password,
  });
}

export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Manually refresh the session - useful for debugging and error recovery
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    console.log('Session refresh attempt:', { 
      success: !!data.session,
      error: error?.message || null
    });
    return { session: data.session, error };
  } catch (error) {
    console.error('Error refreshing session:', error);
    return { session: null, error };
  }
}

// Helper functions for pets-related operations
export async function getPets() {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
  
  return data as Pet[];
} 