'use client';

import React, { Component, ReactNode, useEffect } from 'react';
import { handleError } from '@/lib/error-service';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component
 * 
 * Catches errors in React component tree and displays a fallback UI
 * Can be used to wrap any component that might throw errors during rendering
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error using our centralized error handler
    handleError(error, {
      severity: 'error',
      context: { errorInfo, component: errorInfo.componentStack },
      userMessage: 'Something went wrong in this component'
    });
  }
  
  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };
  
  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              We're sorry, but there was an error. You can try refreshing the page or contact support if the problem persists.
            </p>
            <Button 
              variant="outline" 
              onClick={this.resetErrorBoundary}
              className="mt-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    
    return this.props.children;
  }
}

/**
 * Error boundary hook for functional components
 * 
 * @param error The error that was thrown
 * @param resetErrorBoundary Function to reset the error boundary
 */
export function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
}): ReactNode {
  useEffect(() => {
    // Log the error when the fallback is displayed
    handleError(error, {
      severity: 'error',
      context: { component: 'ErrorFallback' },
    });
  }, [error]);
  
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button 
          variant="outline" 
          onClick={resetErrorBoundary}
          className="mt-2"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export default ErrorBoundary; 