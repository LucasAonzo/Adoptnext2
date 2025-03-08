'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/lib/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function AdoptionSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [petName, setPetName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  const supabase = createClientComponentClient();
  
  // Fix hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fetch pet data to display the pet's name
  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (!params.id) {
          return;
        }
        
        const { data, error } = await supabase
          .from('pets')
          .select('name')
          .eq('id', params.id as string)
          .single();
          
        if (data) {
          setPetName(data.name);
        }
      } catch (err) {
        console.error('Error fetching pet:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if mounted and authenticated
    if (mounted && isAuthenticated) {
      fetchPet();
    } else if (mounted && !isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [params.id, supabase, mounted, isAuthenticated, isLoading, router]);

  // Show loading state while client-side rendering is happening
  if (!mounted || isLoading) {
    return (
      <div className="container max-w-3xl py-10">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="bg-green-50 border border-green-200 rounded-md p-8 text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Adoption Request Submitted!
        </h1>
        <p className="text-green-700 text-lg mb-6">
          {loading ? 'Your' : `Your request to adopt ${petName}`} has been submitted successfully. 
          Our team will review your application and contact you soon.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/pets">
              Browse More Pets
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
        <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
          <li>Our team will review your adoption request within 1-2 business days.</li>
          <li>We may contact you for additional information or to schedule a meeting.</li>
          <li>If approved, we'll arrange a time for you to meet the pet (if you haven't already).</li>
          <li>Once all requirements are met, you'll be able to welcome your new pet home!</li>
        </ol>
      </div>
    </div>
  );
} 