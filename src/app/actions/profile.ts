'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Pet } from '@/types/pets';

// Define a profile type so we know what data to expect
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

// Define a common result type for all actions
export interface ActionResult<T> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Gets the current user's profile
 * @returns The user's profile data
 */
export async function getUserProfile(): Promise<ActionResult<UserProfile>> {
  console.log('getUserProfile - Server action called');
  
  try {
    // Create supabase client with proper cookie handling
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: () => cookieStore });
    
    // Skip problematic cookie logging for now
    console.log('getUserProfile - Checking authentication...');

    // Get the session and user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return {
        success: false,
        error: `Authentication error: ${sessionError.message}`
      };
    }
    
    if (!session) {
      console.error('No session found');
      return {
        success: false,
        error: 'Authentication error: Auth session missing!'
      };
    }
    
    console.log('getUserProfile - Session found for user:', session.user.id);
    
    // Get the user info
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return {
        success: false,
        error: `Authentication error: ${userError.message}`
      };
    }
    
    if (!user) {
      console.error('No user found');
      return {
        success: false,
        error: 'Authentication error: User not found'
      };
    }
    
    console.log('getUserProfile - User found:', user.id);
    
    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    console.log('getUserProfile - Profile fetch result:', { 
      hasProfile: !!profile, 
      profileError: profileError?.message || null,
      profileData: profile ? 'Profile data exists' : null
    });
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      
      // If the error is that the profile doesn't exist, return a default profile
      if (profileError.code === 'PGRST116') {
        return {
          success: true,
          data: {
            id: user.id,
            name: user.user_metadata?.name || null,
            email: user.email || '',
            phone: user.phone || null,
            address: null,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString(),
          }
        };
      }
      
      return {
        success: false,
        error: `Failed to fetch profile: ${profileError.message}`
      };
    }

    // If profile doesn't exist, return the user data with null values for profile fields
    if (!profile) {
      return {
        success: true,
        data: {
          id: user.id,
          name: user.user_metadata?.name || null,
          email: user.email || '',
          phone: user.phone || null,
          address: null,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
        }
      };
    }

    // Return the profile data
    return {
      success: true,
      data: {
        ...profile,
        email: user.email || profile.email || '',
      }
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return {
      success: false,
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Gets the pets published by the current user
 * @returns The user's published pets
 */
export async function getUserPublishedPets(): Promise<ActionResult<Pet[]>> {
  console.log('getUserPublishedPets - Server action called');
  
  try {
    // Create supabase client with proper cookie handling
    const cookieStore = cookies();
    // Use without awaiting to avoid the sync/dynamic APIs error
    const supabase = createServerActionClient({ cookies: () => cookieStore });
    
    console.log('getUserPublishedPets - Checking authentication...');

    try {
      // Get the session and user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        return {
          success: false,
          error: `Authentication error: ${sessionError.message}`,
          data: [] // Return empty array instead of undefined
        };
      }
      
      if (!session) {
        console.error('No session found');
        return {
          success: false,
          error: 'Authentication error: Auth session missing!',
          data: [] // Return empty array instead of undefined
        };
      }
      
      const userId = session.user.id;
      console.log('getUserPublishedPets - Session found for user:', userId);
      
      // Fetch the user's published pets
      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
        
      if (petsError) {
        console.error('Error fetching pets:', petsError);
        return {
          success: false,
          error: `Failed to fetch pets: ${petsError.message}`,
          data: [] // Return empty array instead of undefined
        };
      }
      
      console.log(`getUserPublishedPets - Fetched ${pets?.length || 0} pets successfully`);
      
      return {
        success: true,
        data: pets || []
      };
    } catch (innerError) {
      console.error('Error in server operations:', innerError);
      return {
        success: false,
        error: innerError instanceof Error ? innerError.message : 'Unknown server error',
        data: [] // Return empty array instead of undefined
      };
    }
  } catch (error) {
    console.error('Error in getUserPublishedPets:', error);
    return {
      success: false,
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: [] // Return empty array instead of undefined
    };
  }
} 