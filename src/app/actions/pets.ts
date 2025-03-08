'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { Pet } from '@/types/pets';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

// Define validation schema for pet data
const petSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['perro', 'gato', 'otro'], {
    errorMap: () => ({ message: 'Please select a valid pet type' }),
  }),
  breed: z.string().min(1, 'Breed is required'),
  age: z.coerce.number().int().min(0, 'Age must be a positive number'),
  size: z.string().min(1, 'Size is required'),
  gender: z.string().min(1, 'Gender is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image_url: z.string().nullable().optional(),
  status: z.enum(['disponible', 'en_proceso', 'adoptado'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }).default('disponible'),
});

export type PetFormData = z.infer<typeof petSchema>;
export type ActionResult<T = void> = { success: boolean; data?: T; error?: string };

/**
 * Create a new pet
 */
export async function createPet(formData: FormData): Promise<ActionResult<Pet>> {
  try {
    // Get the Supabase URL and key from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error');
    }
    
    // Create a Supabase admin client with the service role key
    // This bypasses RLS policies but requires careful use
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Try to get the user ID from the form data
    const userId = formData.get('owner_id') as string;
    
    if (!userId) {
      console.error('No owner_id provided in form data');
      throw new Error('User ID is required to create a pet');
    }
    
    console.log('Creating pet for user:', userId);

    // Extract and validate form data
    const rawData = Object.fromEntries(formData.entries());
    
    console.log('Raw form data:', rawData);
    
    // Parse using zod schema
    const validatedData = petSchema.parse(rawData);
    
    console.log('Validated data:', validatedData);
    
    // Add the owner_id field
    const petData = {
      ...validatedData,
      owner_id: userId
    };
    
    console.log('Final pet data to insert:', petData);
    
    // Insert into database using the admin client
    const { data, error } = await supabaseAdmin
      .from('pets')
      .insert(petData)
      .select()
      .single();
    
    if (error) {
      console.error('Database error when inserting pet:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Pet created successfully:', data);
    
    // Revalidate relevant paths
    revalidatePath('/pets');
    
    return { 
      success: true, 
      data: data as Pet 
    };
  } catch (error) {
    console.error('Error in createPet action:', error);
    
    if (error instanceof z.ZodError) {
      // Format validation errors
      const errorMessage = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return { 
        success: false, 
        error: `Validation error: ${errorMessage}` 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Update an existing pet
 */
export async function updatePet(id: string, formData: FormData): Promise<ActionResult<Pet>> {
  try {
    // Get the Supabase URL and key from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error');
    }
    
    // Create a Supabase admin client with the service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Try to get the user ID from the form data
    const userId = formData.get('owner_id') as string;
    
    if (!userId) {
      console.error('No owner_id provided in form data');
      throw new Error('User ID is required to update a pet');
    }
    
    console.log('Updating pet for user:', userId);

    // Check if pet exists
    const { data: existingPet, error: fetchError } = await supabaseAdmin
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching pet:', fetchError);
      throw new Error(`Pet not found: ${fetchError.message}`);
    }
    
    // Check if user is the owner
    if (existingPet.owner_id !== userId) {
      console.error('Unauthorized update attempt:', {
        petOwnerId: existingPet.owner_id,
        requestUserId: userId
      });
      throw new Error('You can only update your own pets');
    }

    // Extract and validate form data
    const rawData = Object.fromEntries(formData.entries());
    
    console.log('Raw form data for update:', rawData);
    
    // Parse using zod schema
    const validatedData = petSchema.parse({
      ...existingPet,
      ...rawData
    });
    
    console.log('Validated data for update:', validatedData);
    
    // Update in database
    const { data, error } = await supabaseAdmin
      .from('pets')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Database error when updating pet:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Pet updated successfully:', data);
    
    // Revalidate relevant paths
    revalidatePath('/pets');
    revalidatePath(`/pets/${id}`);
    
    return { 
      success: true, 
      data: data as Pet 
    };
  } catch (error) {
    console.error('Error in updatePet action:', error);
    
    if (error instanceof z.ZodError) {
      // Format validation errors
      const errorMessage = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return { 
        success: false, 
        error: `Validation error: ${errorMessage}` 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Delete a pet
 */
export async function deletePet(id: string, userId: string): Promise<ActionResult> {
  try {
    // Get the Supabase URL and key from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error');
    }
    
    // Create a Supabase admin client with the service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    if (!userId) {
      console.error('No user ID provided');
      throw new Error('User ID is required to delete a pet');
    }
    
    console.log('Deleting pet for user:', userId);

    // Check if pet exists and user is the owner
    const { data: existingPet, error: fetchError } = await supabaseAdmin
      .from('pets')
      .select('owner_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching pet:', fetchError);
      throw new Error(`Pet not found: ${fetchError.message}`);
    }
    
    // Check if user is the owner
    if (existingPet.owner_id !== userId) {
      console.error('Unauthorized delete attempt:', {
        petOwnerId: existingPet.owner_id,
        requestUserId: userId
      });
      throw new Error('You can only delete your own pets');
    }
    
    // Delete from database
    const { error } = await supabaseAdmin
      .from('pets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Database error when deleting pet:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Pet deleted successfully');
    
    // Revalidate relevant paths
    revalidatePath('/pets');
    
    return { success: true };
  } catch (error) {
    console.error('Error in deletePet action:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Update a pet's status
 */
export async function updatePetStatus(
  id: string, 
  status: 'disponible' | 'en_proceso' | 'adoptado'
): Promise<ActionResult<Pet>> {
  try {
    // Create a Supabase server client with properly awaited cookies
    const cookieStore = cookies();
    const supabaseServer = createServerActionClient({
      cookies: () => cookieStore
    });

    // Get the current user
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user) {
      console.error('Authentication error: No user found in session');
      throw new Error('You must be logged in to update a pet status');
    }

    // Check if pet exists and user is the owner
    const { data: existingPet, error: fetchError } = await supabaseServer
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw new Error(`Pet not found: ${fetchError.message}`);
    
    // Check if user is the owner
    if (existingPet.owner_id !== user.id) {
      throw new Error('You can only update your own pets');
    }
    
    // Update status in database
    const { data, error } = await supabaseServer
      .from('pets')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Database error: ${error.message}`);
    
    // Revalidate relevant paths
    revalidatePath('/pets');
    revalidatePath(`/pets/${id}`);
    
    return { 
      success: true, 
      data: data as Pet 
    };
  } catch (error) {
    console.error('Error in updatePetStatus action:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 