import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { projectRef } from '@/lib/supabase';

// Environment-based logging flag - only logs in development when explicitly enabled
const ENABLE_MIDDLEWARE_LOGS = false; // Set to true only when debugging middleware issues

/**
 * Simple logging utility that only logs when enabled
 */
function debugLog(...args: any[]) {
  if (ENABLE_MIDDLEWARE_LOGS && process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

export async function middleware(request: NextRequest) {
  // Log the request URL for debugging
  debugLog('Middleware - Processing URL:', request.nextUrl.pathname);
  
  // Get all cookies for debugging
  const allCookies = Array.from(request.cookies.getAll()).map(c => c.name);
  debugLog('Middleware - All cookies:', allCookies);
  
  // Check for auth cookies with any Supabase project reference
  const authCookies = allCookies.filter(name => 
    name.startsWith('sb-') && name.includes('-auth-token')
  );
  debugLog('Middleware - Auth cookies found:', authCookies);
  
  // Check specific project cookie
  const projectCookie = `sb-${projectRef}-auth-token`;
  const hasProjectCookie = request.cookies.has(projectCookie);
  debugLog(`Middleware - Project-specific auth cookie (${projectCookie}) present:`, hasProjectCookie);
  
  // Initialize response that we'll modify with cookies if needed
  let response = NextResponse.next();
  
  // Create and initialize Supabase client with proper cookie handling
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  try {
    // Check the auth state using verifyAuth to handle cookies correctly
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Debug logging
    if (session) {
      debugLog('Middleware - Session found for user:', session.user.id);
    } else {
      debugLog('Middleware - No valid session found');
      
      if (hasProjectCookie) {
        debugLog('Middleware - Auth cookie exists but no session - possible invalid/expired token');
      }
    }

    // Handle '/auth' path - redirect away if already authenticated
    if (session && request.nextUrl.pathname.startsWith('/auth')) {
      const redirectPath = new URL(
        request.nextUrl.searchParams.get('redirect') || '/',
        request.url
      );
      debugLog('Middleware - User already authenticated, redirecting from /auth to:', redirectPath.pathname);
      return NextResponse.redirect(redirectPath);
    }

    // Handle protected routes - but don't redirect profile pages,
    // let the client components handle auth to avoid redirect loops
    if (!session && !request.nextUrl.pathname.startsWith('/profile')) {
      // For protected API routes, return unauthorized
      if (request.nextUrl.pathname.startsWith('/api/protected')) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        );
      }
    }
    
    return response;
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware - Error checking authentication:', error);
    }
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 