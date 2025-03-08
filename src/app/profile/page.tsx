'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, Heart, LogOut, PawPrint, User } from 'lucide-react';
import Link from 'next/link';
import { UserProfileCard } from '@/components/profile/user-profile-card';
import { UserPetsList } from '@/components/pets/user-pets-list';
import { getUserProfile, getUserPublishedPets } from '@/app/actions/profile';
import { UserProfile } from '@/app/actions/profile';
import { Pet } from '@/types/pets';
import { toast } from 'sonner';
import { useAuthStore, useUser, useIsAuthenticated, useIsLoading } from '@/lib/stores/auth-store';
import { ClientProfileData } from '@/components/profile/client-profile-data';
import { supabase, createBrowserClient, checkAuthCookies, clearAllAuthCookies } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProfilePage() {
  const router = useRouter();
  // Use the Zustand auth store hooks
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isAuthLoading = useIsLoading();
  const authStoreSignOut = useAuthStore((state) => state.signOut);
  const checkAndFixAuth = useAuthStore((state) => state.checkAndFixAuth);
  
  // State for profile data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [serverActionFailed, setServerActionFailed] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [petsError, setPetsError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<boolean>(isAuthenticated);
  const [cookieMismatchDetected, setCookieMismatchDetected] = useState(false);
  
  // Initialize browser client
  const browserClient = typeof window !== 'undefined' 
    ? createBrowserClient()
    : supabase;
  
  // Check for authentication issues on mount
  useEffect(() => {
    if (isAuthLoading) return;
    
    const checkAuthStatus = async () => {
      // Check for cookie mismatches or other auth issues
      const authCookies = checkAuthCookies();
      console.log('Profile page - Auth cookies:', authCookies);
      
      // Check session from the browser client
      const { data: { session } } = await browserClient.auth.getSession();
      console.log('Profile page - Session check:', { 
        hasSession: !!session,
        sessionUserId: session?.user?.id || null 
      });
      
      // If cookies exist but no session, we have a cookie mismatch
      if (authCookies.length > 0 && !session) {
        console.log('Profile page - Cookie mismatch detected');
        setCookieMismatchDetected(true);
        
        // Try to fix auth
        const fixed = await checkAndFixAuth();
        if (fixed) {
          console.log('Auth issues fixed, fetching profile');
          fetchProfileData();
        } else {
          console.log('Auth issues could not be fixed');
          setAuthError('Authentication error: Please sign in again');
        }
      } else if (!isAuthenticated || !session) {
        // No auth at all, redirect to login
        console.log('Profile page - Not authenticated, redirecting to login');
        router.push('/auth?redirect=/profile');
      } else {
        // We have a valid session, fetch profile
        console.log('Profile page - Authenticated, fetching profile');
        fetchProfileData();
      }
    };
    
    checkAuthStatus();
  }, [isAuthenticated, isAuthLoading, router]);
  
  // Handle tab change with immediate data loading
  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value);
    setActiveTab(value);
    
    // If switching to pets tab and we have a profile but no pets yet, load pets
    if (value === 'pets' && profile && !pets.length && !isLoadingPets) {
      console.log('Tab changed to pets - triggering pets fetch');
      fetchPets();
    }
  };
  
  // Load pets when the pets tab is selected or when profile is loaded
  useEffect(() => {
    // Check if we should load pets (active tab is pets, we have a profile, and not already loading)
    if (activeTab === 'pets' && profile && !isLoadingPets) {
      console.log('useEffect detected pets tab is active - checking if pets need to be loaded');
      
      // Only fetch if we don't already have pets or if there was an error previously
      if (!pets.length || petsError) {
        console.log('No pets loaded yet or previous error - triggering pets fetch');
        fetchPets();
      } else {
        console.log('Pets already loaded, count:', pets.length);
      }
    }
  }, [activeTab, profile, petsError]); // Removed pets.length and isLoadingPets dependencies
  
  // Function to fetch user profile
  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      
      // First, double-check authentication status on the client side
      const { data: { session } } = await browserClient.auth.getSession();
      console.log('Profile page - Client-side session check:', { 
        hasSession: !!session,
        sessionUserId: session?.user?.id || null
      });
      
      // If no session is detected client-side, skip the server action
      if (!session) {
        console.log('No session detected client-side, skipping server action');
        setAuthError('Authentication error: No session found');
        return await fetchClientSideProfile();
      }

      // Attempt to fetch profile via server action
      console.log('Attempting to fetch profile via server action...');
      const result = await getUserProfile();
      
      if (!result.success) {
        console.error('Error fetching profile:', result.error);
        
        // Check specifically for auth session missing error
        if (result.error && result.error.includes('Auth session missing')) {
          console.log('Auth session missing error - possible cookie mismatch');
          console.log('Falling back to client-side profile fetch');
          setCookieMismatchDetected(true);
          
          // Try to refresh the session before falling back
          try {
            const { data, error } = await browserClient.auth.refreshSession();
            console.log('Session refresh attempt:', { success: !!data.session, error: error?.message });
          } catch (refreshError) {
            console.error('Error refreshing session:', refreshError);
          }
          
          return await fetchClientSideProfile();
        }
        
        // For other errors, show the error
        setProfileError(result.error || 'Unknown error');
        return;
      }
      
      if (result.data) {
        setProfile(result.data);
        // Only fetch pets if we successfully got the profile
        fetchPets();
      }
    } catch (error) {
      console.error('Error in fetchProfileData:', error);
      setProfileError('Failed to load profile data');
      setAuthError('Authentication error occurred');
      
      // Fallback to client-side fetch
      await fetchClientSideProfile();
    } finally {
      setIsLoadingProfile(false);
    }
  };
  
  // Fetch profile data client-side as a fallback
  const fetchClientSideProfile = async () => {
    try {
      console.log('Fetching profile data client-side as fallback');
      
      // Try to fix auth issues first
      const fixed = await checkAndFixAuth();
      if (!fixed) {
        console.log('Could not fix auth issues, aborting profile fetch');
        setAuthState(false);
        return false;
      }
      
      // Get current user after auth is fixed
      const { data: { user } } = await browserClient.auth.getUser();
      
      console.log('Client-side auth check:', { 
        hasUser: !!user, 
        userId: user?.id || null
      });
      
      if (!user) {
        console.log('No authenticated user found client-side');
        // Instead of immediately redirecting, set state to show a login prompt
        setAuthState(false);
        return false;
      }
      
      // We have a user, so set authenticated state
      setAuthState(true);
      
      // Fetch profile with related data
      const { data: profile, error: profileError } = await browserClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile client-side:', profileError);
        
        // If profile doesn't exist, create a default one
        if (profileError.code === 'PGRST116') {
          setProfile({
            id: user.id,
            name: user.user_metadata?.name || null,
            email: user.email || '',
            phone: user.phone || null,
            address: null,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString(),
          });
        } else {
          setProfileError('Error loading profile: ' + profileError.message);
        }
      } else if (profile) {
        setProfile(profile);
      }
      
      // Also fetch pets client-side
      fetchClientSidePets();
      
      return true;
    } catch (error) {
      console.error('Error in client-side profile fetch:', error);
      setProfileError('Error loading profile data');
      setAuthState(false);
      return false;
    }
  };
  
  // Fetch pets when the pets tab is selected
  const fetchPets = async () => {
    if (!profile) {
      console.log('Cannot fetch pets: No profile available');
      return;
    }
    
    // Skip if already loading
    if (isLoadingPets) {
      console.log('Already loading pets, skipping duplicate fetch');
      return;
    }
    
    try {
      console.log('Starting pets fetch...');
      setIsLoadingPets(true);
      setPetsError(null);
      
      const result = await getUserPublishedPets();
      console.log('Pets fetch result:', { 
        success: result.success, 
        count: result.data?.length || 0,
        error: result.error || null
      });
      
      if (result.success && result.data) {
        setPets(result.data);
        console.log('Pets data loaded successfully, count:', result.data.length);
      } else {
        console.error('Failed to load pets:', result.error);
        toast.error(result.error || 'Failed to load your pets');
        setPetsError(result.error || 'Failed to load pets');
        setServerActionFailed(true);
        
        // Fallback to client-side fetch
        console.log('Server action failed, falling back to client-side fetch');
        await fetchClientSidePets();
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Failed to load your pets');
      setPetsError(error instanceof Error ? error.message : 'Unknown error fetching pets');
      setServerActionFailed(true);
      
      // Fallback to client-side fetch
      console.log('Error caught, falling back to client-side fetch');
      await fetchClientSidePets();
    } finally {
      setIsLoadingPets(false);
    }
  };
  
  // Fetch pets client-side as a fallback
  const fetchClientSidePets = async () => {
    if (!profile) {
      console.log('Cannot fetch pets client-side: No profile available');
      return;
    }
    
    try {
      console.log('Fetching pets client-side as fallback');
      const { data, error } = await browserClient
        .from('pets')
        .select('*')
        .eq('owner_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pets client-side:', error);
        toast.error('Failed to load your pets');
        setPetsError(`Client-side error: ${error.message}`);
      } else {
        console.log(`Loaded ${data?.length || 0} pets client-side`);
        if (data && data.length > 0) {
          setPets(data);
          setPetsError(null);
        } else {
          console.log('No pets found client-side');
        }
      }
    } catch (error) {
      console.error('Error in client-side pets fetch:', error);
      setPetsError('Failed to load pets client-side');
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      toast.loading('Signing out...');
      
      // Clear all auth cookies before signing out
      clearAllAuthCookies();
      
      await authStoreSignOut();
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  // Handle sign out and sign in again (recovery option)
  const handleSignOutAndSignIn = async () => {
    try {
      toast.loading('Signing out...');
      
      // Clear all auth cookies first
      clearAllAuthCookies();
      
      await authStoreSignOut();
      router.push('/auth?redirect=/profile');
      toast.success('Signed out successfully. Please sign in again.');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  // Show loading state while auth is being checked
  if (isAuthLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading authentication state...</p>
        </div>
      </div>
    );
  }
  
  // Show login prompt if not authenticated
  if (!authState && !isLoadingProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-amber-500" />
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground text-center max-w-md">
            You need to be signed in to view your profile.
          </p>
          <Button asChild>
            <Link href="/auth?redirect=/profile">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile and view your pets
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/profile/adoptions">
              <Heart className="h-4 w-4 mr-2" />
              My Adoptions
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {cookieMismatchDetected && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">Authentication Issue Detected</AlertTitle>
          <AlertDescription className="text-red-700">
            <p className="mb-2">
              We detected an issue with your authentication cookies. This can happen when cookies are blocked or corrupted.
            </p>
            <p className="mb-4">
              To fix this issue, try signing out and signing in again.
            </p>
            <Button variant="destructive" onClick={handleSignOutAndSignIn}>
              Sign Out and Sign In Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {serverActionFailed && !cookieMismatchDetected && !authError && (
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
      
      {authError && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">Authentication Error</AlertTitle>
          <AlertDescription className="text-red-700">
            <p className="mb-2">{authError}</p>
            <Button variant="destructive" onClick={handleSignOutAndSignIn}>
              Sign Out and Sign In Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {profileError && (
        <Alert className="mb-6 border-amber-500 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Profile Error</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>{profileError}</p>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="pets">
            <PawPrint className="h-4 w-4 mr-2" />
            My Pets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          {!profile || isLoadingProfile ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <UserProfileCard profile={profile} />
              <div className="flex justify-end">
                <Button asChild>
                  <Link href="/profile/edit">Edit Profile</Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pets" className="space-y-6">
          {isLoadingPets ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading pets...</p>
              </div>
            </div>
          ) : petsError ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">My Published Pets</h2>
                <Button asChild>
                  <Link href="/pets/create">Add New Pet</Link>
                </Button>
              </div>
              
              <Alert className="mb-6 border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-700">Error Loading Pets</AlertTitle>
                <AlertDescription className="text-red-700">
                  <p className="mb-2">{petsError}</p>
                  <Button variant="outline" onClick={() => fetchPets()}>
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
              
              {pets.length > 0 && (
                <UserPetsList pets={pets} emptyMessage="You haven't published any pets yet." />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">My Published Pets</h2>
                <Button asChild>
                  <Link href="/pets/create">Add New Pet</Link>
                </Button>
              </div>
              
              {pets.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <PawPrint className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Pets Found</h3>
                  <p className="text-muted-foreground mb-6">You haven't published any pets yet.</p>
                  <Button asChild>
                    <Link href="/pets/create">Add Your First Pet</Link>
                  </Button>
                </div>
              ) : (
                <UserPetsList pets={pets} emptyMessage="You haven't published any pets yet." />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 