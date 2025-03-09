'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { type Pet } from '@/types/pets';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createAdminClient, performAdminOperation } from '@/lib/supabase-admin';

// Define validation schema for adoption requests
const adoptionRequestSchema = z.object({
  message: z.string().min(10, 'Please provide a detailed message explaining why you want to adopt this pet.'),
  petId: z.string().uuid('Invalid pet ID'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  userId: z.string().uuid('Invalid user ID'),
});

export type AdoptionFormData = z.infer<typeof adoptionRequestSchema>;
export type ActionResult<T = undefined> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

/**
 * Creates a server-side Supabase client with access to cookies
 * This ensures proper authentication in server actions
 */
function createServerActionClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
}

/**
 * Get the current user ID from the session
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Creates a new adoption request
 * Server action that handles form submission for adoption requests
 * Uses the admin client to bypass RLS
 */
export async function createAdoptionRequest(petId: string, userId: string, message: string): Promise<ActionResult<{ id: string }>> {
  try {
    // Basic validation
    if (!petId) {
      return {
        success: false,
        error: 'Pet ID is required'
      };
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    if (!message) {
      return {
        success: false,
        error: 'Message is required'
      };
    }

    // Validate with zod schema if needed
    if (adoptionRequestSchema) {
      const validationResult = adoptionRequestSchema.safeParse({
        petId,
        userId,
        message
      });

      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error.errors[0].message
        };
      }
    }
    
    // Use performAdminOperation to execute and log the admin action
    const result = await performAdminOperation({
      action: 'create_adoption_request',
      table: 'adoptions',
      userId,
      details: { petId, message },
      operation: async () => {
        // Create admin client that bypasses RLS
        const supabase = createAdminClient();
        
        // Insert adoption request using admin client
        const { data, error } = await supabase
          .from('adoptions')
          .insert({
            pet_id: petId,
            adopter_id: userId,
            message: message,
            status: 'pendiente'
          })
          .select('id')
          .single();
        
        if (error) {
          throw new Error(`Failed to create adoption request: ${error.message}`);
        }
        
        return data;
      }
    });
    
    return { 
      success: true, 
      data: result
    };
  } catch (error) {
    console.error('Error creating adoption request:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error creating adoption request'
    };
  }
}

/**
 * Get adoption requests for the current user
 */
export async function getUserAdoptionRequests(): Promise<ActionResult<{ adoptions: any[] }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { 
        success: false, 
        error: 'You must be logged in to view your adoption requests' 
      };
    }
    
    const { data, error } = await supabase
      .from('adoptions')
      .select(`
        id, 
        status, 
        message, 
        created_at,
        pet_id,
        pets (
          id,
          name,
          image_url,
          type,
          breed
        )
      `)
      .eq('adopter_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch adoption requests: ${error.message}`);
    }
    
    return { 
      success: true, 
      data: { adoptions: data || [] } 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Cancel an adoption request (only allowed if status is 'pendiente')
 */
export async function cancelAdoptionRequest(adoptionId: string): Promise<ActionResult<undefined>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { 
        success: false, 
        error: 'You must be logged in to cancel an adoption request' 
      };
    }
    
    // Get the adoption request and check if it belongs to the current user
    const { data: adoption, error: fetchError } = await supabase
      .from('adoptions')
      .select('id, status, pet_id, adopter_id')
      .eq('id', adoptionId)
      .single();
    
    if (fetchError || !adoption) {
      return { 
        success: false, 
        error: `Adoption request not found: ${fetchError?.message || 'Unknown error'}` 
      };
    }
    
    // Verify that the adoption request belongs to the current user
    if (adoption.adopter_id !== session.user.id) {
      return { 
        success: false, 
        error: 'You do not have permission to cancel this adoption request' 
      };
    }
    
    // Only allow cancellation if the status is 'pendiente'
    if (adoption.status !== 'pendiente') {
      return { 
        success: false, 
        error: `Cannot cancel adoption request with status: ${adoption.status}` 
      };
    }
    
    // Delete the adoption request
    const { error: deleteError } = await supabase
      .from('adoptions')
      .delete()
      .eq('id', adoptionId);
    
    if (deleteError) {
      throw new Error(`Failed to delete adoption request: ${deleteError.message}`);
    }
    
    // Update the pet status back to 'disponible'
    const { error: updateError } = await supabase
      .from('pets')
      .update({ status: 'disponible' })
      .eq('id', adoption.pet_id);
    
    if (updateError) {
      console.error(`Failed to update pet status: ${updateError.message}`);
    }
    
    // Revalidate relevant paths
    revalidatePath('/pets');
    revalidatePath(`/pets/${adoption.pet_id}`);
    revalidatePath('/profile/adoptions');
    
    return { success: true, data: undefined };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Get adoption requests for admin review
 * This should be protected with admin authorization
 */
export async function getAdminAdoptionRequests(): Promise<ActionResult<{ adoptions: any[] }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { 
        success: false, 
        error: 'You must be logged in to view adoption requests' 
      };
    }
    
    // TODO: Add admin check
    // For now, we'll assume the user is an admin
    
    const { data, error } = await supabase
      .from('adoptions')
      .select(`
        id, 
        status, 
        message, 
        created_at,
        pet_id,
        adopter_id,
        pets (
          id,
          name,
          image_url,
          type,
          breed
        ),
        profiles (
          id,
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch adoption requests: ${error.message}`);
    }
    
    return { 
      success: true, 
      data: { adoptions: data || [] } 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Update the status of an adoption request (admin only)
 */
export async function updateAdoptionStatus(
  adoptionId: string, 
  status: 'aprobada' | 'rechazada',
  adminNotes?: string
): Promise<ActionResult<undefined>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { 
        success: false, 
        error: 'You must be logged in to update adoption status' 
      };
    }
    
    // TODO: Add admin check
    // For now, we'll assume the user is an admin
    
    // Get the adoption request
    const { data: adoption, error: fetchError } = await supabase
      .from('adoptions')
      .select('id, status, pet_id')
      .eq('id', adoptionId)
      .single();
    
    if (fetchError || !adoption) {
      return { 
        success: false, 
        error: `Adoption request not found: ${fetchError?.message || 'Unknown error'}` 
      };
    }
    
    // Only allow updates if the status is 'pendiente'
    if (adoption.status !== 'pendiente') {
      return { 
        success: false, 
        error: `Cannot update adoption with status: ${adoption.status}` 
      };
    }
    
    // Update the adoption request status
    const { error: updateError } = await supabase
      .from('adoptions')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', adoptionId);
    
    if (updateError) {
      throw new Error(`Failed to update adoption status: ${updateError.message}`);
    }
    
    // Update the pet status based on the adoption decision
    const newPetStatus = status === 'aprobada' ? 'adoptado' : 'disponible';
    
    const { error: petUpdateError } = await supabase
      .from('pets')
      .update({ status: newPetStatus })
      .eq('id', adoption.pet_id);
    
    if (petUpdateError) {
      console.error(`Failed to update pet status: ${petUpdateError.message}`);
    }
    
    // Revalidate relevant paths
    revalidatePath('/pets');
    revalidatePath(`/pets/${adoption.pet_id}`);
    revalidatePath('/profile/adoptions');
    revalidatePath('/admin/adoptions');
    
    return { success: true, data: undefined };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 