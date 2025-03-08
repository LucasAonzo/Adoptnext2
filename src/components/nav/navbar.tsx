'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, LogOut, LogIn, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore, useIsAuthenticated, useUser, useIsLoading, logAuthState, useForceUpdate } from '@/lib/stores/auth-store';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Get auth state from Zustand store
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();
  const forceUpdate = useForceUpdate(); // Add forceUpdate to trigger re-renders
  const signOut = useAuthStore((state) => state.signOut);

  // Fix hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
    
    // Log detailed auth state
    logAuthState();
  }, [isAuthenticated, user, isLoading, forceUpdate]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      
      // Log auth state after sign out
      logAuthState();
      
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Log auth state changes for debugging
  useEffect(() => {
    if (mounted) {
      // No logging needed
    }
  }, [isAuthenticated, user, mounted, isLoading, forceUpdate]);

  // Force re-render on auth state change
  useEffect(() => {
    if (mounted) {
      if (isAuthenticated) {
        // Small delay to ensure state is stable
        const timeout = setTimeout(() => {
          router.refresh();
        }, 100);
        return () => clearTimeout(timeout);
      }
    }
  }, [forceUpdate, mounted, router, isAuthenticated]);

  // Render different UI based on authentication state
  const renderAuthUI = () => {
    if (!mounted) {
      // Show skeleton while client-side rendering is happening
      return <div className="h-9 w-9 rounded-full bg-gray-200"></div>;
    }
    
    if (isLoading) {
      // Show loading spinner while auth state is being determined
      return (
        <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (isAuthenticated && user) {
      // User is authenticated
      return (
        <div className="flex items-center gap-4">
          <Link href="/profile" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User size={18} />
            </div>
            <span className="hidden md:inline-block">{user.email?.split('@')[0] || 'User'}</span>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut} 
            className="gap-1"
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden md:inline-block">Signing out...</span>
              </>
            ) : (
              <>
                <LogOut size={16} />
                <span className="hidden md:inline-block">Logout</span>
              </>
            )}
          </Button>
        </div>
      );
    }
    
    // User is not authenticated
    return (
      <Link href="/login">
        <Button variant="default" size="sm" className="gap-1">
          <LogIn size={16} />
          <span>Login</span>
        </Button>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Adopt</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/pets"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === '/pets' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Pets
            </Link>
            <Link
              href="/about"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === '/about' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === '/contact' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center">
          {renderAuthUI()}
        </div>
      </div>
    </header>
  );
} 