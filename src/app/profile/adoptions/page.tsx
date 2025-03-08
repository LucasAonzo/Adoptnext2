'use client';

import { useEffect, useState } from 'react';
import { AdoptionRequestList } from '@/components/adoptions/adoption-request-list';
import { getUserAdoptionRequests } from '@/app/actions/adoptions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore, useUser, useIsAuthenticated, useIsLoading } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function UserAdoptionsPage() {
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverActionFailed, setServerActionFailed] = useState(false);
  const router = useRouter();
  
  // Use the Zustand auth store hooks
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isAuthLoading = useIsLoading();
  const signOut = useAuthStore((state) => state.signOut);
  
  // Check authentication using the Zustand store
  useEffect(() => {
    console.log('Adoptions page - Auth state from store:', { 
      isAuthenticated, 
      hasUser: !!user, 
      isAuthLoading 
    });
    
    // Only check when auth is not loading
    if (!isAuthLoading) {
      if (!isAuthenticated || !user) {
        console.log('Not authenticated according to store, redirecting to auth page');
        router.push('/auth?redirect=/profile/adoptions');
      } else {
        console.log('Authenticated according to store, user:', user.email);
        // Fetch adoptions data when authenticated
        fetchAdoptions();
      }
    }
  }, [isAuthenticated, user, isAuthLoading, router]);
  
  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const result = await getUserAdoptionRequests();
      
      if (!result.success) {
        // If not logged in, redirect to login page
        if (result.error?.includes('logged in')) {
          toast.error('Please log in to view your adoption requests');
          router.push('/auth?redirect=/profile/adoptions');
          return;
        }
        
        // Check if the error message indicates an auth session missing error
        if (result.error?.includes('Auth session missing')) {
          console.log('Auth session missing error - possible cookie mismatch');
          console.log('Attempting to refresh session and retry...');
          
          try {
            // Try to refresh the session
            const { data, error } = await supabase.auth.refreshSession();
            if (data.session) {
              console.log('Session refreshed successfully, trying client-side fetch');
              // Try client-side fetch as a fallback
              fetchClientSideAdoptions();
              return;
            } else {
              console.error('Session refresh failed:', error);
              setServerActionFailed(true);
            }
          } catch (refreshError) {
            console.error('Error refreshing session:', refreshError);
            setServerActionFailed(true);
          }
        }
        
        throw new Error(result.error);
      }
      
      setAdoptions(result.data?.adoptions || []);
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
      setError(error instanceof Error ? error.message : 'Failed to load adoption requests');
      toast.error('Failed to load your adoption requests');
      setServerActionFailed(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch adoptions data client-side as a fallback
  const fetchClientSideAdoptions = async () => {
    try {
      console.log('Fetching adoptions data client-side as fallback');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No user found in client-side adoptions fetch');
        return;
      }
      
      // Fetch adoptions with related pet data
      const { data, error } = await supabase
        .from('adoptions')
        .select(`
          *,
          pet:pets(*)
        `)
        .eq('adopter_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching adoptions client-side:', error);
        setError('Error loading adoption requests: ' + error.message);
      } else {
        console.log(`Loaded ${data?.length || 0} adoption requests client-side`);
        setAdoptions(data || []);
        setServerActionFailed(true);
      }
    } catch (error) {
      console.error('Error in client-side adoptions fetch:', error);
      setError('Error loading adoption requests');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sign out and sign in again
  const handleSignOutAndSignIn = async () => {
    try {
      // Clear all auth cookies
      const cookies = document.cookie.split(';').map(c => c.trim());
      const authCookies = cookies.filter(c => 
        c.startsWith('sb-') && c.includes('-auth-token')
      );
      
      authCookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0];
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`Cleared cookie: ${cookieName}`);
      });
      
      await signOut();
      router.push('/auth?redirect=/profile/adoptions');
      toast.success('Signed out successfully. Please sign in again.');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  if (isAuthLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-40 w-full md:w-1/4 rounded-md" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null; // This will not render as the useEffect will redirect
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Adoption Requests</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your pet adoption applications
          </p>
        </div>
        
        <Button asChild>
          <Link href="/pets">Browse More Pets</Link>
        </Button>
      </div>
      
      {serverActionFailed && (
        <Alert className="mb-6 border-amber-500 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Server Communication Issue</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">
              We're having trouble communicating with the server. Using client-side data as a fallback.
            </p>
            <p className="mb-4">
              Some features may be limited. If this persists, try signing out and signing in again.
            </p>
            <Button variant="outline" onClick={handleSignOutAndSignIn}>
              Sign Out and Sign In Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-40 w-full md:w-1/4 rounded-md" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-600">Error</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <AdoptionRequestList 
          adoptions={adoptions}
          emptyMessage="You haven't requested to adopt any pets yet."
        />
      )}
    </div>
  );
} 