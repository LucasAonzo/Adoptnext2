# Implementation Plan for Codebase Improvements

This document outlines the planned improvements for the Adopt frontend codebase in three key areas: security, error handling, and testing. Use this as a living document to track progress as each improvement is implemented.

## 1. Security Improvements for Admin Client

The current implementation of the `createAdminClient()` function in `supabase-admin.ts` creates a Supabase client with service role privileges that bypasses Row Level Security (RLS). This is powerful but potentially dangerous if misused.

### Implementation Plan:

- [ ] **Create an Admin Action Logging System**:
  ```typescript
  // Create a new file: src/lib/admin-logger.ts
  
  type AdminAction = {
    action: string;
    table: string;
    performedBy: string;
    details: Record<string, any>;
    timestamp: Date;
  };
  
  export async function logAdminAction(action: AdminAction) {
    const supabase = createAdminClient();
    
    return supabase
      .from('admin_audit_logs')
      .insert({
        action: action.action,
        table: action.table,
        performed_by: action.performedBy,
        details: action.details,
        created_at: action.timestamp
      });
  }
  ```

- [ ] **Create a Type-Safe Admin Client Wrapper**:
  ```typescript
  // Modify src/lib/supabase-admin.ts
  
  import { createClient } from '@supabase/supabase-js';
  import { logAdminAction } from './admin-logger';
  
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
   * Performs an admin operation with logging
   */
  export async function performAdminOperation<T>({
    action,
    table,
    userId,
    operation,
    details
  }: {
    action: string;
    table: string;
    userId: string;
    operation: () => Promise<T>;
    details?: Record<string, any>;
  }): Promise<T> {
    try {
      const result = await operation();
      
      // Log the successful operation
      await logAdminAction({
        action,
        table,
        performedBy: userId,
        details: details || {},
        timestamp: new Date()
      });
      
      return result;
    } catch (error) {
      // Log the failed operation
      await logAdminAction({
        action: `${action}_failed`,
        table,
        performedBy: userId,
        details: { error: error.message, ...(details || {}) },
        timestamp: new Date()
      });
      
      throw error;
    }
  }
  ```

- [ ] **Create Database Table for Audit Logs**:
  ```sql
  CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    performed_by UUID REFERENCES auth.users(id),
    details JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
  );
  
  -- Add RLS policies to prevent modification
  ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
  
  -- Only allow service_role to insert
  CREATE POLICY "Allow service_role to insert logs" 
    ON admin_audit_logs FOR INSERT 
    USING (true);
  
  -- Only allow admins to view logs
  CREATE POLICY "Allow admins to view logs" 
    ON admin_audit_logs FOR SELECT 
    USING (auth.uid() IN (SELECT id FROM admins));
  ```

- [ ] **Update Existing Admin Operations**:
  ```typescript
  // Example update to src/app/actions/adoptions.ts
  
  import { performAdminOperation } from '@/lib/supabase-admin';
  
  export async function createAdoptionRequest(petId: string, userId: string, message: string) {
    // Validation code...
    
    return performAdminOperation({
      action: 'create_adoption_request',
      table: 'adoptions',
      userId,
      operation: async () => {
        const supabase = createAdminClient();
        
        const { data, error } = await supabase
          .from('adoptions')
          .insert({
            pet_id: petId,
            adopter_id: userId,
            message: message,
            status: 'pendiente'
          })
          .select()
          .single();
          
        if (error) throw error;
        return data;
      },
      details: { petId, message }
    });
  }
  ```

## 2. Error Handling Improvements

The current error handling is inconsistent across the application. Some errors are logged to the console without clear user notifications, which can lead to a poor user experience.

### Implementation Plan:

- [ ] **Create a Centralized Error Handling Service**:
  ```typescript
  // Create a new file: src/lib/error-service.ts
  
  import { toast } from 'sonner'; // or your preferred toast library
  
  type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';
  
  interface ErrorOptions {
    severity?: ErrorSeverity;
    userMessage?: string;
    context?: Record<string, any>;
    reportToAnalytics?: boolean;
  }
  
  export function handleError(error: Error | unknown, options: ErrorOptions = {}) {
    const {
      severity = 'error',
      userMessage = 'An unexpected error occurred',
      context = {},
      reportToAnalytics = true
    } = options;
    
    // 1. Log to console with context
    console.error(`[${severity.toUpperCase()}]`, error, context);
    
    // 2. Show user-friendly message
    if (userMessage) {
      switch (severity) {
        case 'info':
          toast.info(userMessage);
          break;
        case 'warning':
          toast.warning(userMessage);
          break;
        case 'error':
        case 'critical':
          toast.error(userMessage);
          break;
      }
    }
    
    // 3. Report to analytics service if needed
    if (reportToAnalytics) {
      // Implement analytics reporting here
      // Example: reportErrorToAnalytics(error, severity, context);
    }
    
    // 4. Return the error for further handling if needed
    return error;
  }
  ```

- [ ] **Create Global Error Boundary Component**:
  ```tsx
  // Create a new file: src/components/error-boundary.tsx
  
  'use client';
  
  import { useEffect } from 'react';
  import { handleError } from '@/lib/error-service';
  
  interface ErrorBoundaryProps {
    children: React.ReactNode;
  }
  
  interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
  }
  
  class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      handleError(error, {
        severity: 'error',
        context: { errorInfo },
        userMessage: 'Something went wrong. Please try again or contact support.'
      });
    }
    
    render() {
      if (this.state.hasError) {
        return (
          <div className="error-container p-4 border border-red-300 bg-red-50 rounded-md">
            <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
            <p className="text-red-600 mt-2">
              We're sorry, but there was an error. Please try again or contact support.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        );
      }
      
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;
  ```

- [ ] **Update Root Layout to Include Error Boundary**:
  ```tsx
  // Update src/app/layout.tsx
  
  import { Toaster } from 'sonner'; // or your preferred toast library
  import ErrorBoundary from '@/components/error-boundary';
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster position="top-right" />
        </body>
      </html>
    );
  }
  ```

- [ ] **Standardize Server Action Error Handling**:
  ```typescript
  // Create a new file: src/lib/action-utils.ts
  
  import { handleError } from './error-service';
  
  type ActionResult<T> = {
    success: boolean;
    data?: T;
    error?: string;
  };
  
  export async function safeAction<T>(
    action: () => Promise<T>,
    errorMessage = 'Failed to perform action'
  ): Promise<ActionResult<T>> {
    try {
      const result = await action();
      return { success: true, data: result };
    } catch (error) {
      handleError(error, {
        userMessage: errorMessage,
        severity: 'error',
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : errorMessage
      };
    }
  }
  ```

- [ ] **Update Server Actions to Use Standardized Error Handling**:
  ```typescript
  // Example update to src/app/actions/adoptions.ts
  
  import { safeAction } from '@/lib/action-utils';
  
  export async function getUserAdoptionRequests(userId: string) {
    return safeAction(
      async () => {
        // Implementation...
      },
      'Failed to fetch your adoption requests'
    );
  }
  ```

## 3. Testing Strategy

The application has testing dependencies like @playwright/test and vitest in package.json, but no tests have been implemented. This can impact long-term stability.

### Implementation Plan:

- [x] **Set up the testing infrastructure (Vitest and Playwright)** (Date: Today, Developer: Your Name)
  - Created vitest.config.ts for unit testing configuration
  - Created playwright.config.ts for E2E testing configuration
  - Set up test setup file with common mocks
- [x] **Write unit tests for critical utilities and components** (Date: Today, Developer: Your Name)
  - Created a unit test for the Button component
  - Created a unit test for the error service
- [x] **Create E2E tests for the most important user flows** (Date: Today, Developer: Your Name)
  - Created an E2E test for the adoption flow
  - Added tests for viewing pets and submitting adoption requests
- [x] **Update package.json Scripts** (Date: Today, Developer: Your Name)
  - Added test scripts for running Vitest and Playwright tests
  - Added UI modes for interactive test running
  - Added coverage reporting script

## Implementation Roadmap

To implement these improvements incrementally, follow this roadmap:

### Phase 1: Security (Highest Priority)
- [x] **Create an Admin Action Logging System** (Date: Today, Developer: Your Name)
  - Created SQL script to create admin_audit_logs and admins tables with proper RLS policies
  - Implemented admin-logger.ts for logging admin actions
- [x] **Create a Type-Safe Admin Client Wrapper** (Date: Today, Developer: Your Name)
  - Updated supabase-admin.ts to verify server-side execution
  - Added performAdminOperation function to wrap and log all admin operations
- [x] **Update Existing Admin Operations** (Date: Today, Developer: Your Name)
  - Refactored createAdoptionRequest in adoptions.ts to use performAdminOperation

### Phase 2: Error Handling
- [x] **Implement the centralized error handling service** (Date: Today, Developer: Your Name)
  - Created error-service.ts with handleError and getErrorMessage functions
  - Added support for different severity levels and toast notifications
  - Added context capturing for detailed error logging
- [x] **Create and integrate the error boundary component** (Date: Today, Developer: Your Name)
  - Implemented ErrorBoundary component with fallback UI
  - Added ErrorFallback function for use in functional components
  - Integrated with the error handling service for consistent error reporting
  - Updated root layout to wrap the application in the ErrorBoundary component
- [x] **Standardize server action error handling** (Date: Today, Developer: Your Name)
  - Created action-utils.ts with safeAction wrapper function
  - Implemented standard ActionResult type for consistent responses
  - Added helper functions for success/error results and parameter validation
- [x] **Add toast notifications for user-facing errors** (Date: Today, Developer: Your Name)
  - Leveraged existing sonner toast library and components
  - Integrated with error handling service for consistent notifications

### Phase 3: Testing
- [x] **Set up the testing infrastructure (Vitest and Playwright)** (Date: Today, Developer: Your Name)
  - Created vitest.config.ts for unit testing configuration
  - Created playwright.config.ts for E2E testing configuration
  - Set up test setup file with common mocks
- [x] **Write unit tests for critical utilities and components** (Date: Today, Developer: Your Name)
  - Created a unit test for the Button component
  - Created a unit test for the error service
- [x] **Create E2E tests for the most important user flows** (Date: Today, Developer: Your Name)
  - Created an E2E test for the adoption flow
  - Added tests for viewing pets and submitting adoption requests
- [x] **Update package.json Scripts** (Date: Today, Developer: Your Name)
  - Added test scripts for running Vitest and Playwright tests
  - Added UI modes for interactive test running
  - Added coverage reporting script

## Progress Tracking

Use this section to track completed tasks and add notes about implementation details or challenges encountered.

### Completed Tasks
- [x] **Create an Admin Action Logging System** (Date: Today, Developer: Your Name)
  - Created SQL script to create admin_audit_logs and admins tables with proper RLS policies
  - Implemented admin-logger.ts for logging admin actions
- [x] **Create a Type-Safe Admin Client Wrapper** (Date: Today, Developer: Your Name)
  - Updated supabase-admin.ts to verify server-side execution
  - Added performAdminOperation function to wrap and log all admin operations
- [x] **Update Existing Admin Operations** (Date: Today, Developer: Your Name)
  - Refactored createAdoptionRequest in adoptions.ts to use performAdminOperation
- [x] **Implement the centralized error handling service** (Date: Today, Developer: Your Name)
  - Created error-service.ts with handleError and getErrorMessage functions
  - Added support for different severity levels and toast notifications
  - Added context capturing for detailed error logging
- [x] **Create and integrate the error boundary component** (Date: Today, Developer: Your Name)
  - Implemented ErrorBoundary component with fallback UI
  - Added ErrorFallback function for use in functional components
  - Integrated with the error handling service for consistent error reporting
  - Updated root layout to wrap the application in the ErrorBoundary component
- [x] **Standardize server action error handling** (Date: Today, Developer: Your Name)
  - Created action-utils.ts with safeAction wrapper function
  - Implemented standard ActionResult type for consistent responses
  - Added helper functions for success/error results and parameter validation
- [x] **Add toast notifications for user-facing errors** (Date: Today, Developer: Your Name)
  - Leveraged existing sonner toast library and components
  - Integrated with error handling service for consistent notifications
- [x] **Set up the testing infrastructure (Vitest and Playwright)** (Date: Today, Developer: Your Name)
  - Created vitest.config.ts for unit testing configuration
  - Created playwright.config.ts for E2E testing configuration
  - Set up test setup file with common mocks
- [x] **Write unit tests for critical utilities and components** (Date: Today, Developer: Your Name)
  - Created a unit test for the Button component
  - Created a unit test for the error service
- [x] **Create E2E tests for the most important user flows** (Date: Today, Developer: Your Name)
  - Created an E2E test for the adoption flow
  - Added tests for viewing pets and submitting adoption requests
- [x] **Update package.json Scripts** (Date: Today, Developer: Your Name)
  - Added test scripts for running Vitest and Playwright tests
  - Added UI modes for interactive test running
  - Added coverage reporting script

### Notes
- Created a separate admins table since there wasn't an existing way to identify admin users in the system
- Decided not to throw errors in the logAdminAction function to prevent breaking core functionality if logging fails
- Enhanced error handling and validation in the createAdoptionRequest function while refactoring
- Found that the sonner toast library was already set up in the project, so we leveraged the existing components
- The ErrorBoundary was implemented as a class component since React's error boundary functionality requires class components
- Created a comprehensive set of mocks in the test setup file to ensure tests can run without external dependencies
- Set up E2E tests to cover the core adoption flow, which is the primary user journey in the application 