import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { projectRef } from '@/lib/supabase';

export async function middleware(request: NextRequest) {
  // Log the request URL for debugging
  console.log('Middleware - Processing URL:', request.nextUrl.pathname);
  
  // Get all cookies for debugging
  const allCookies = Array.from(request.cookies.getAll()).map(c => c.name);
  console.log('Middleware - All cookies:', allCookies);
  
  // Check for auth cookies with any Supabase project reference
  const authCookies = allCookies.filter(name => 
    name.startsWith('sb-') && name.includes('-auth-token')
  );
  console.log('Middleware - Auth cookies found:', authCookies);
  
  // Check specific project cookie
  const projectCookie = `sb-${projectRef}-auth-token`;
  const hasProjectCookie = request.cookies.has(projectCookie);
  console.log(`Middleware - Project-specific auth cookie (${projectCookie}) present:`, hasProjectCookie);
  
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
      console.log('Middleware - Session found for user:', session.user.id);
    } else {
      console.log('Middleware - No valid session found');
      
      if (hasProjectCookie) {
        console.log('Middleware - Auth cookie exists but no session - possible invalid/expired token');
      }
    }

    // Handle '/auth' path - redirect away if already authenticated
    if (session && request.nextUrl.pathname.startsWith('/auth')) {
      const redirectPath = new URL(
        request.nextUrl.searchParams.get('redirect') || '/',
        request.url
      );
      console.log('Middleware - User already authenticated, redirecting from /auth to:', redirectPath.pathname);
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
    console.error('Middleware - Error checking authentication:', error);
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 