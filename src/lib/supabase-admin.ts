import { createClient } from '@supabase/supabase-js';
import { logAdminAction, AdminAction } from './admin-logger';

/**
 * Creates a Supabase client with the service role key
 * This client bypasses Row Level Security and should ONLY be used in server-side code
 * NEVER expose this client to the browser
 */
export function createAdminClient() {
  // Verify we're on the server
  if (typeof window !== 'undefined') {
    throw new Error('Admin client can only be used on the server');
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or service role key');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Parameters for performAdminOperation function
 */
export interface AdminOperationParams<T> {
  action: string;
  table: string;
  userId: string;
  operation: () => Promise<T>;
  details?: Record<string, any>;
}

/**
 * Performs an admin operation with logging
 * This wraps admin operations to ensure they are logged and properly handled
 * 
 * @param params The parameters for the admin operation
 * @returns The result of the operation
 */
export async function performAdminOperation<T>({
  action,
  table,
  userId,
  operation,
  details = {}
}: AdminOperationParams<T>): Promise<T> {
  try {
    // Execute the operation
    console.log(`[ADMIN OPERATION] Starting ${action} on ${table}`);
    const result = await operation();
    
    // Log successful operation
    await logAdminAction({
      action,
      table,
      performedBy: userId,
      details,
      timestamp: new Date()
    });
    
    console.log(`[ADMIN OPERATION] Completed ${action} on ${table} successfully`);
    return result;
  } catch (error) {
    // Log failed operation
    console.error(`[ADMIN OPERATION ERROR] Failed ${action} on ${table}:`, error);
    
    await logAdminAction({
      action: `${action}_failed`,
      table,
      performedBy: userId,
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        ...details 
      },
      timestamp: new Date()
    });
    
    // Re-throw the error to be handled by the caller
    throw error;
  }
} 