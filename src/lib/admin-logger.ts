import { createAdminClient } from './supabase-admin';

/**
 * Represents an administrative action performed in the system
 */
export type AdminAction = {
  action: string;
  table: string;
  performedBy: string;
  details: Record<string, any>;
  timestamp: Date;
};

/**
 * Logs an administrative action to the admin_audit_logs table
 * This provides accountability for operations performed with admin privileges
 */
export async function logAdminAction(action: AdminAction) {
  const supabase = createAdminClient();
  
  console.log(`[ADMIN ACTION] Logging ${action.action} on ${action.table} by ${action.performedBy}`);
  
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .insert({
      action: action.action,
      table_name: action.table,
      performed_by: action.performedBy,
      details: action.details,
      created_at: action.timestamp
    });
  
  if (error) {
    console.error('[ADMIN ACTION ERROR] Failed to log action:', error);
    // We don't throw here to prevent breaking the main operation
    // Just log the error and continue
  }
  
  return { data, error };
} 