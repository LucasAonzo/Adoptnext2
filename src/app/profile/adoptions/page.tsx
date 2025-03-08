'use client';

import { useEffect, useState } from 'react';
import { AdoptionRequestList } from '@/components/adoptions/adoption-request-list';
import { getUserAdoptionRequests } from '@/app/actions/adoptions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function UserAdoptionsPage() {
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true);
        const result = await getUserAdoptionRequests();
        
        if (!result.success) {
          // If not logged in, redirect to login page
          if (result.error?.includes('logged in')) {
            toast.error('Please log in to view your adoption requests');
            router.push('/auth/login?redirect=/profile/adoptions');
            return;
          }
          
          throw new Error(result.error);
        }
        
        setAdoptions(result.data?.adoptions || []);
      } catch (error) {
        console.error('Error fetching adoption requests:', error);
        setError(error instanceof Error ? error.message : 'Failed to load adoption requests');
        toast.error('Failed to load your adoption requests');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdoptions();
  }, [router]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Adoption Requests</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your pet adoption applications
          </p>
        </div>
        
        <Button asChild>
          <Link href="/pets">Browse More Pets</Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-40 w-full md:w-1/4 rounded-md" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-600">Error</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <AdoptionRequestList 
          adoptions={adoptions}
          emptyMessage="You haven't requested to adopt any pets yet."
        />
      )}
    </div>
  );
} 