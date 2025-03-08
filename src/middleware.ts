import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/adopt'];
  
  // If user is not signed in and trying to access a protected route,
  // redirect the user to /auth
  if (!session && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth';
    
    // Add the original URL as a redirect parameter
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    
    return NextResponse.redirect(redirectUrl);
  }

  // If user is signed in and the current path is /auth,
  // redirect the user to / or the redirect URL if provided
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = redirectTo;
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 