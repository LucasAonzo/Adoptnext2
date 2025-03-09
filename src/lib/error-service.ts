import { toast } from 'sonner';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Options for error handling
 */
export interface ErrorOptions {
  /** The severity level of the error */
  severity?: ErrorSeverity;
  /** User-friendly message to display */
  userMessage?: string;
  /** Additional context to log with the error */
  context?: Record<string, any>;
  /** Whether to report this error to analytics */
  reportToAnalytics?: boolean;
}

/**
 * Creates a standardized error object with additional context
 */
export function createError(message: string, context?: Record<string, any>): Error {
  const error = new Error(message);
  if (context) {
    (error as any).context = context;
  }
  return error;
}

/**
 * Centralized error handling service
 * This provides consistent error handling throughout the application
 * 
 * @param error The error to handle
 * @param options Additional options for handling the error
 * @returns The original error (allows for chaining)
 */
export function handleError(error: Error | unknown, options: ErrorOptions = {}): Error | unknown {
  const {
    severity = 'error',
    userMessage = error instanceof Error ? error.message : 'An unexpected error occurred',
    context = {},
    reportToAnalytics = true
  } = options;
  
  // 1. Log to console with context
  const errorContext = error instanceof Error && (error as any).context 
    ? { ...(error as any).context, ...context }
    : context;
  
  console.error(`[${severity.toUpperCase()}]`, error, errorContext);
  
  // 2. Show user-friendly message
  if (userMessage) {
    switch (severity) {
      case 'info':
        toast.info(userMessage);
        break;
      case 'warning':
        toast.warning(userMessage);
        break;
      case 'critical':
        toast.error(userMessage, {
          duration: 10000, // Show for longer
        });
        break;
      case 'error':
      default:
        toast.error(userMessage);
        break;
    }
  }
  
  // 3. Report to analytics service if enabled
  if (reportToAnalytics) {
    // Implementation will depend on your analytics service
    // Example:
    // reportErrorToAnalytics({
    //   error,
    //   severity,
    //   context: errorContext,
    //   message: userMessage
    // });
  }
  
  // 4. Return the error for further handling if needed
  return error;
}

/**
 * Attempt to extract a user-friendly message from an error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  
  return 'An unexpected error occurred';
} 