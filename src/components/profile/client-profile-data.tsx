'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfileCard } from '@/components/profile/user-profile-card';
import { UserPetsList } from '@/components/pets/user-pets-list';
import { UserProfile } from '@/app/actions/profile';
import { Pet } from '@/types/pets';
import { toast } from 'sonner';
import { useUser, useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientProfileDataProps {
  activeTab: string;
}

export function ClientProfileData({ activeTab }: ClientProfileDataProps) {
  const user = useUser();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have a user from the store
        if (!user || !isAuthenticated) {
          console.log('ClientProfileData - No user in store, checking session directly');
          
          // Try to get the session directly from Supabase
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('ClientProfileData - Error getting session:', sessionError);
            setError('Authentication error: ' + sessionError.message);
            router.push('/auth?redirect=/profile');
            return;
          }
          
          if (!session) {
            console.log('ClientProfileData - No session found, redirecting to auth');
            router.push('/auth?redirect=/profile');
            return;
          }
          
          console.log('ClientProfileData - Session found despite no user in store');
        } else {
          console.log('ClientProfileData - User authenticated from store:', user.email);
        }
        
        // If we reach here, we have authentication
        fetchProfileData();
        if (activeTab === 'pets') {
          fetchPetsData();
        }
      } catch (error) {
        console.error('ClientProfileData - Error checking auth:', error);
        setError('Error checking authentication status');
      }
    };
    
    checkAuth();
  }, [user, isAuthenticated, activeTab, router]);
  
  // Fetch profile data directly using Supabase client
  const fetchProfileData = async () => {
    if (!user && !(await checkSessionExists())) return;
    
    try {
      setIsLoadingProfile(true);
      console.log('ClientProfileData - Fetching profile data');
      
      // First try to get profile from database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id || (await getCurrentUserId()))
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('ClientProfileData - Error fetching profile:', profileError);
        toast.error('Failed to load profile data');
        setError('Error loading profile: ' + profileError.message);
        
        // Create a default profile from user data if available
        if (user) {
          setProfile({
            id: user.id,
            name: user.user_metadata?.name || null,
            email: user.email || '',
            phone: user.phone || null,
            address: null,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString(),
          });
        }
      } else {
        // If profile exists, use it
        if (profileData) {
          console.log('ClientProfileData - Profile data loaded successfully');
          setProfile({
            ...profileData,
            email: user?.email || profileData.email || '',
          });
          setError(null);
        } else {
          // Create a default profile from user data
          console.log('ClientProfileData - No profile found, creating default');
          const currentUser = user || await getCurrentUser();
          if (currentUser) {
            setProfile({
              id: currentUser.id,
              name: currentUser.user_metadata?.name || null,
              email: currentUser.email || '',
              phone: currentUser.phone || null,
              address: null,
              created_at: currentUser.created_at || new Date().toISOString(),
              updated_at: currentUser.updated_at || new Date().toISOString(),
            });
          } else {
            setError('Could not determine user profile');
          }
        }
      }
    } catch (error) {
      console.error('ClientProfileData - Error in client profile fetch:', error);
      toast.error('Failed to load profile');
      setError('Error loading profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  };
  
  // Fetch pets data directly using Supabase client
  const fetchPetsData = async () => {
    if (!user && !(await checkSessionExists())) return;
    
    try {
      setIsLoadingPets(true);
      console.log('ClientProfileData - Fetching pets data');
      
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user?.id || (await getCurrentUserId()))
        .order('created_at', { ascending: false });
      
      if (petsError) {
        console.error('ClientProfileData - Error fetching pets:', petsError);
        toast.error('Failed to load your pets');
        setError('Error loading pets: ' + petsError.message);
        setPets([]);
      } else {
        console.log(`ClientProfileData - Loaded ${petsData?.length || 0} pets`);
        setPets(petsData || []);
        if (petsData && petsData.length > 0) {
          setError(null);
        }
      }
    } catch (error) {
      console.error('ClientProfileData - Error in client pets fetch:', error);
      toast.error('Failed to load your pets');
      setError('Error loading pet data');
    } finally {
      setIsLoadingPets(false);
    }
  };
  
  // Helper function to check if a session exists
  const checkSessionExists = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('ClientProfileData - Error checking session:', error);
      return false;
    }
  };
  
  // Helper function to get current user ID
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch (error) {
      console.error('ClientProfileData - Error getting current user ID:', error);
      return null;
    }
  };
  
  // Helper function to get current user
  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('ClientProfileData - Error getting current user:', error);
      return null;
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
        console.log(`ClientProfileData - Cleared cookie: ${cookieName}`);
      });
      
      await supabase.auth.signOut();
      router.push('/auth?redirect=/profile');
      toast.success('Signed out successfully. Please sign in again.');
    } catch (error) {
      console.error('ClientProfileData - Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  if (activeTab === 'profile') {
    return (
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{error}</p>
              <p className="mb-4">
                This could be due to an authentication issue. Try signing out and signing in again.
              </p>
              <Button variant="destructive" onClick={handleSignOutAndSignIn}>
                Sign Out and Sign In Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
          <p className="text-yellow-800 text-sm">
            Using client-side data fetching as a fallback. Some features may be limited.
          </p>
        </div>
        <UserProfileCard profile={profile} isLoading={isLoadingProfile} />
      </div>
    );
  }
  
  if (activeTab === 'pets') {
    return (
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{error}</p>
              <p className="mb-4">
                This could be due to an authentication issue. Try signing out and signing in again.
              </p>
              <Button variant="destructive" onClick={handleSignOutAndSignIn}>
                Sign Out and Sign In Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
          <p className="text-yellow-800 text-sm">
            Using client-side data fetching as a fallback. Some features may be limited.
          </p>
        </div>
        <UserPetsList pets={pets} isLoading={isLoadingPets} />
      </div>
    );
  }
  
  return null;
} 