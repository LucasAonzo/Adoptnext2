import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client that works on the server-side
 * This client has access to cookies and can be used in server actions
 * to properly identify the authenticated user
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Ensure we're setting the cookie with the correct options
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          } catch (error) {
            // This can happen in production when we can't modify cookies
            console.error('Error setting cookie', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Ensure we're removing the cookie with the correct options
            cookieStore.set(name, '', {
              ...options,
              maxAge: 0,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          } catch (error) {
            // This can happen in production when we can't modify cookies
            console.error('Error removing cookie', error);
          }
        },
      },
    }
  );
} 