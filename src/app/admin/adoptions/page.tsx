'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdoptionStatusBadge } from '@/components/adoptions/adoption-status-badge';
import { PetImage } from '@/components/pets/pet-image';
import { formatDate } from '@/lib/utils';
import { getAdminAdoptionRequests, updateAdoptionStatus } from '@/app/actions/adoptions';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

type AdoptionStatus = 'pendiente' | 'aprobada' | 'rechazada';

interface AdoptionRequest {
  id: string;
  status: AdoptionStatus;
  message: string;
  created_at: string;
  pet_id: string;
  adopter_id: string;
  pets: {
    id: string;
    name: string;
    image_url: string | null;
    type: string;
    breed: string;
  };
  profiles: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminAdoptionsPage() {
  const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdoptionStatus>('pendiente');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  
  useEffect(() => {
    fetchAdoptions();
  }, []);
  
  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const result = await getAdminAdoptionRequests();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setAdoptions(result.data?.adoptions || []);
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
      setError(error instanceof Error ? error.message : 'Failed to load adoption requests');
      toast.error('Failed to load adoption requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async (adoptionId: string) => {
    try {
      setProcessingId(adoptionId);
      const result = await updateAdoptionStatus(adoptionId, 'aprobada', adminNotes);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success('Adoption request approved successfully');
      setAdminNotes('');
      fetchAdoptions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve adoption request');
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleReject = async (adoptionId: string) => {
    try {
      setProcessingId(adoptionId);
      const result = await updateAdoptionStatus(adoptionId, 'rechazada', adminNotes);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success('Adoption request rejected successfully');
      setAdminNotes('');
      fetchAdoptions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject adoption request');
    } finally {
      setProcessingId(null);
    }
  };
  
  const filteredAdoptions = adoptions.filter(adoption => adoption.status === activeTab);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-10 w-full max-w-xs mb-6" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-6 space-y-4 mb-4">
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
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Adoption Requests</h1>
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-600">Error</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fetchAdoptions()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Manage Adoption Requests</h1>
      <p className="text-muted-foreground mb-8">
        Review and process pet adoption applications
      </p>
      
      <Tabs 
        defaultValue="pendiente" 
        className="space-y-4"
        onValueChange={(value: string) => setActiveTab(value as AdoptionStatus)}
      >
        <TabsList>
          <TabsTrigger value="pendiente" className="relative">
            Pending
            {adoptions.filter(a => a.status === 'pendiente').length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {adoptions.filter(a => a.status === 'pendiente').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="aprobada">Approved</TabsTrigger>
          <TabsTrigger value="rechazada">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendiente" className="space-y-4">
          {filteredAdoptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending adoption requests</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing {filteredAdoptions.length} pending {filteredAdoptions.length === 1 ? 'request' : 'requests'}
              </p>
              {filteredAdoptions.map((adoption) => (
                <AdoptionRequestCard
                  key={adoption.id}
                  adoption={adoption}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  processingId={processingId}
                  adminNotes={adminNotes}
                  setAdminNotes={setAdminNotes}
                />
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="aprobada" className="space-y-4">
          {filteredAdoptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No approved adoption requests</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing {filteredAdoptions.length} approved {filteredAdoptions.length === 1 ? 'request' : 'requests'}
              </p>
              {filteredAdoptions.map((adoption) => (
                <AdoptionRequestCard
                  key={adoption.id}
                  adoption={adoption}
                  viewOnly
                />
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="rechazada" className="space-y-4">
          {filteredAdoptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rejected adoption requests</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing {filteredAdoptions.length} rejected {filteredAdoptions.length === 1 ? 'request' : 'requests'}
              </p>
              {filteredAdoptions.map((adoption) => (
                <AdoptionRequestCard
                  key={adoption.id}
                  adoption={adoption}
                  viewOnly
                />
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AdoptionRequestCardProps {
  adoption: AdoptionRequest;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  processingId?: string | null;
  viewOnly?: boolean;
  adminNotes?: string;
  setAdminNotes?: (notes: string) => void;
}

function AdoptionRequestCard({
  adoption,
  onApprove,
  onReject,
  processingId,
  viewOnly = false,
  adminNotes = '',
  setAdminNotes
}: AdoptionRequestCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            Request for {adoption.pets.name}
          </CardTitle>
          <AdoptionStatusBadge status={adoption.status} />
        </div>
        <CardDescription>
          Submitted on {formatDate(adoption.created_at)} by {adoption.profiles.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <PetImage 
            pet={adoption.pets} 
            className="rounded-md object-cover"
            containerClassName="aspect-square"
          />
          <div className="mt-2 flex flex-col space-y-1">
            <div className="text-sm font-medium">{adoption.profiles.name}</div>
            <div className="text-sm text-muted-foreground">{adoption.profiles.email}</div>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium mb-1">Adoption Message:</h3>
          <p className="text-sm whitespace-pre-line">{adoption.message}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="bg-muted rounded-md px-3 py-1 text-xs">
              Type: {adoption.pets.type}
            </div>
            <div className="bg-muted rounded-md px-3 py-1 text-xs">
              Breed: {adoption.pets.breed}
            </div>
            <div className="bg-muted rounded-md px-3 py-1 text-xs">
              Pet ID: {adoption.pet_id}
            </div>
          </div>
        </div>
      </CardContent>
      
      {!viewOnly && (
        <CardFooter className="pt-4 border-t flex flex-wrap gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1"
                disabled={!!processingId}
              >
                Reject Request
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Adoption Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject this adoption request? 
                  The pet will become available for adoption again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Add notes (optional)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes?.(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground"
                  onClick={() => onReject?.(adoption.id)}
                  disabled={processingId === adoption.id}
                >
                  {processingId === adoption.id ? 'Rejecting...' : 'Reject Adoption'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className="flex-1"
                disabled={!!processingId}
              >
                Approve Adoption
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve Adoption Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve this adoption request? 
                  This will mark the pet as adopted and notify the adopter.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Add notes (optional)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes?.(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onApprove?.(adoption.id)}
                  disabled={processingId === adoption.id}
                >
                  {processingId === adoption.id ? 'Approving...' : 'Approve Adoption'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="secondary"
            asChild
            className="md:flex-auto"
          >
            <Link href={`/pets/${adoption.pet_id}`}>
              View Pet Details
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 