'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Pet } from '@/types/pets';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { createAdoptionRequest } from '@/app/actions/adoptions';
import { Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  message: z.string()
    .min(10, 'Please provide a detailed message explaining why you want to adopt this pet.')
    .max(1000, 'Your message is too long. Please keep it under 1000 characters.'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AdoptionRequestFormProps {
  pet: Pick<Pet, 'id' | 'name' | 'image_url'>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdoptionRequestForm({ pet, onSuccess, onCancel }: AdoptionRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      agreeToTerms: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to request an adoption.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      
      // Create form data for server action
      const formData = new FormData();
      formData.append('petId', pet.id);
      formData.append('message', data.message);
      formData.append('agreeToTerms', data.agreeToTerms.toString());
      formData.append('userId', user.id);
      
      // Submit the form using the server action
      const result = await createAdoptionRequest(formData);
      
      if (!result.success) {
        setFormError(result.error);
        toast.error(result.error);
        return;
      }
      
      // Show success message
      toast.success(`Your request to adopt ${pet.name} has been submitted successfully.`);
      
      // Refresh the page data
      router.refresh();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setFormError(errorMessage);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while client-side rendering is happening
  if (!mounted) {
    return (
      <div className="space-y-4 p-6 border rounded-md">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // Show loading state while auth state is being determined
  if (isLoading) {
    return (
      <div className="space-y-4 p-6 border rounded-md">
        <div className="flex items-center justify-center h-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">Authentication Required</h2>
        <p className="text-amber-700 mb-4">
          You must be logged in to request an adoption. Please log in and try again.
        </p>
        <Button onClick={() => router.push('/login')}>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{formError}</p>
        </div>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to adopt {pet.name}?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us why you want to adopt this pet and a bit about your home environment..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please provide details about your living situation, experience with pets, and why you think you'd be a good match.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the adoption terms and conditions
                </FormLabel>
                <FormDescription>
                  By checking this box, you agree to our adoption process, home visit requirements, and follow-up checks.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Adoption Request'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 