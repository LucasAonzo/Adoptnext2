'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuthStore, useIsLoading, useIsAuthenticated, logAuthState, useForceUpdate } from '@/lib/stores/auth-store';

// Form validation schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  // Get auth actions and state from Zustand store
  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useIsLoading();
  const isAuthenticated = useIsAuthenticated();
  const forceUpdate = useForceUpdate();
  
  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/';

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Log auth state on mount and when it changes
  useEffect(() => {
    // Log detailed auth state
    logAuthState();
    
    // Redirect if already authenticated
    if (isAuthenticated && !redirectAttempted) {
      setRedirectAttempted(true);
      
      // Use a timeout to ensure the UI has time to update
      setTimeout(() => {
        router.push(redirectUrl);
      }, 100);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router, redirectAttempted, forceUpdate]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast.error(error.message || 'Failed to sign in');
        return;
      }
      
      // Log auth state after sign in
      logAuthState();
      
      toast.success('Signed in successfully');
      
      // Set redirect attempted flag
      setRedirectAttempted(true);
      
      // Redirect after successful login with a delay to ensure state is updated
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 1000); // Increased delay to ensure state is fully updated
      
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your account to continue
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Forgot your password?{' '}
          <Link href="/auth/reset-password" className="text-primary hover:underline">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
} 