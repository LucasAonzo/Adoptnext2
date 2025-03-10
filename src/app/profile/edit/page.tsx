'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore, useUser, useIsAuthenticated, useIsLoading } from '@/lib/stores/auth-store';

export default function EditProfilePage() {
  const router = useRouter();
  // Use the Zustand auth store hooks
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isAuthLoading = useIsLoading();

  // Check authentication using the Zustand store
  useEffect(() => {
    console.log('Edit Profile page - Auth state from store:', { 
      isAuthenticated, 
      hasUser: !!user, 
      isAuthLoading 
    });
    
    // Only check when auth is not loading
    if (!isAuthLoading) {
      if (!isAuthenticated || !user) {
        console.log('Not authenticated according to store, redirecting to auth page');
        router.push('/auth?redirect=/profile/edit');
      } else {
        console.log('Authenticated according to store, user:', user.email);
      }
    }
  }, [isAuthenticated, user, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="h-10 w-64 bg-muted rounded animate-pulse mb-8" />
          <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null; // This will not render as the useEffect will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0">
            <Link href="/profile" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Profile editing functionality will be implemented in a future update.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-medium">Currently logged in as:</p>
              <p className="text-sm">{user.email}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/profile">Cancel</Link>
            </Button>
            <Button disabled>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 