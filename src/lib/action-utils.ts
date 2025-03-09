import { handleError, getErrorMessage } from './error-service';

/**
 * Standard result type for server actions
 * This provides a consistent interface for all server action results
 */
export type ActionResult<T = undefined> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

/**
 * Options for the safeAction function
 */
export interface SafeActionOptions {
  /** A user-friendly error message to display when the action fails */
  errorMessage?: string;
  /** Whether to log the error (default: true) */
  logError?: boolean;
  /** Whether to show a toast notification (default: true) */
  showToast?: boolean;
  /** Additional context to include in the error log */
  context?: Record<string, any>;
}

/**
 * Wraps a server action with standard error handling
 * This ensures consistent error handling across all server actions
 * 
 * @param action The server action function to wrap
 * @param options Options for error handling
 * @returns The result of the action with standardized error handling
 */
export async function safeAction<T>(
  action: () => Promise<T>,
  options: SafeActionOptions = {}
): Promise<ActionResult<T>> {
  const {
    errorMessage = 'Failed to perform action',
    logError = true,
    showToast = true,
    context = {}
  } = options;
  
  try {
    // Execute the action
    const result = await action();
    return { success: true, data: result };
  } catch (error) {
    // Get a user-friendly error message
    const message = getErrorMessage(error) || errorMessage;
    
    // Log the error if enabled
    if (logError) {
      handleError(error, {
        userMessage: showToast ? message : undefined,
        context: {
          ...context,
          action: action.name,
        },
        severity: 'error',
      });
    }
    
    // Return a standardized error result
    return {
      success: false,
      error: message
    };
  }
}

/**
 * Helper function to wrap a successful result
 */
export function successResult<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/**
 * Helper function to wrap an error result
 */
export function errorResult<T = undefined>(error: string): ActionResult<T> {
  return { success: false, error };
}

/**
 * Helper function to validate required parameters
 * Returns undefined if valid, error message if invalid
 */
export function validateRequired(params: Record<string, any>): string | undefined {
  const missingParams = Object.entries(params)
    .filter(([_, value]) => value === undefined || value === null || value === '')
    .map(([key, _]) => key);
  
  if (missingParams.length > 0) {
    return `Missing required parameters: ${missingParams.join(', ')}`;
  }
  
  return undefined;
} 