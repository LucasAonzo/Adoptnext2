'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pet } from '@/types/pets';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { deletePet } from '@/app/actions/pets';
import { toast } from 'sonner';
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
import { useAuthStore } from '@/lib/stores/auth-store';

interface PetOwnerActionsProps {
  pet: Pet;
}

export function PetOwnerActions({ pet }: PetOwnerActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleDelete = async () => {
    if (!user) {
      toast.error('You must be logged in to delete a pet');
      return;
    }

    try {
      setIsDeleting(true);
      
      const result = await deletePet(pet.id, user.id);
      
      if (result.success) {
        toast.success('Pet deleted successfully');
        router.push('/pets');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" asChild>
        <Link href={`/pets/edit/${pet.id}`} aria-label="Edit pet">
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Delete pet">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your pet listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 