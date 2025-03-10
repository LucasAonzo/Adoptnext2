'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/lib/stores/auth-store';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pet } from '@/types/pets';
import { Loader2, Upload, X } from 'lucide-react';

// Define the form schema using zod
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['perro', 'gato', 'otro'], {
    errorMap: () => ({ message: 'Please select a valid pet type' }),
  }),
  breed: z.string().min(1, 'Breed is required'),
  age: z.coerce.number().int().min(0, 'Age must be a positive number'),
  size: z.string().min(1, 'Size is required'),
  gender: z.string().min(1, 'Gender is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image_url: z.string().nullable().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PetFormProps {
  pet?: Pet;
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  submitButtonText?: string;
  userId?: string;
}

export function PetForm({ pet, onSubmit, submitButtonText = 'Save Pet', userId }: PetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(pet?.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get auth state from Zustand store
  const { user, session, isAuthenticated, refreshSession } = useAuthStore();
  
  // Use the provided userId or the authenticated user's ID
  const effectiveUserId = userId || user?.id;
  
  // Debug auth state
  useEffect(() => {
    console.log('Auth state in PetForm:', { 
      isAuthenticated, 
      hasUser: !!user,
      hasSession: !!session,
      effectiveUserId
    });
  }, [isAuthenticated, user, session, effectiveUserId]);

  // Initialize the form with default values or existing pet data
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: pet ? {
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age,
      size: pet.size,
      gender: pet.gender,
      description: pet.description,
      image_url: pet.image_url,
    } : {
      name: '',
      type: 'perro',
      breed: '',
      age: 0,
      size: 'Mediano',
      gender: 'Macho',
      description: '',
      image_url: null,
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Update the form value
    form.setValue('image_url', 'pending_upload');
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue('image_url', null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload image using server action instead of client-side upload
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      setIsUploading(true);
      
      // Ensure we have authentication
      if (!isAuthenticated || !user) {
        console.error('Authentication required to upload images');
        toast.error('Authentication required to upload images');
        return null;
      }
      
      // Refresh the session to ensure we have the latest token
      await refreshSession();
      
      console.log('Using auth store for upload:', {
        userId: user.id,
        hasSession: !!session,
        isAuthenticated
      });
      
      // Generate a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      // Create a path that includes the user's ID as a folder name
      const filePath = `${user.id}/${fileName}`;
      
      console.log('Attempting to upload file:', {
        userId: user.id,
        fileName,
        filePath,
        fileSize: imageFile.size,
        fileType: imageFile.type
      });
      
      // Use the global Supabase client
      const supabaseClient = createClientComponentClient();
      
      // Upload the file
      const { data, error } = await supabaseClient.storage
        .from('pets-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        console.error('Error details:', {
          message: error.message,
          name: error.name
        });
        toast.error(`Failed to upload image: ${error.message}`);
        return null;
      }
      
      console.log('File uploaded successfully:', data);
      
      // Get the public URL
      const { data: urlData } = supabaseClient.storage
        .from('pets-images')
        .getPublicUrl(filePath);
      
      console.log('Public URL generated:', urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Unexpected error during upload:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      toast.error('Failed to upload image: unexpected error');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Upload image if there's a new file
      if (imageFile) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          data.image_url = imageUrl;
        } else {
          // If upload failed, don't proceed
          toast.error('Failed to upload image');
          return { success: false, error: 'Failed to upload image' };
        }
      }
      
      const result = await onSubmit(data);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to save pet');
        return result;
      }
      
      toast.success('Pet saved successfully');
      
      // Redirect to pets page after successful submission
      router.push('/pets');
      router.refresh();
      
      return result;
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pet's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Type Field */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="perro">Dog</SelectItem>
                    <SelectItem value="gato">Cat</SelectItem>
                    <SelectItem value="otro">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Breed Field */}
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input placeholder="Pet's breed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Age Field */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="Pet's age" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Size Field */}
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pequeño">Small</SelectItem>
                    <SelectItem value="Mediano">Medium</SelectItem>
                    <SelectItem value="Grande">Large</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Gender Field */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Macho">Male</SelectItem>
                    <SelectItem value="Hembra">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Image Upload Field */}
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Image preview */}
                  {imagePreview && (
                    <div className="relative w-full max-w-md h-48 border rounded-md overflow-hidden">
                      <Image 
                        src={imagePreview} 
                        alt="Pet preview" 
                        fill 
                        className="object-cover" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {/* File input */}
                  {!imagePreview && (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload an image of your pet</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload a clear image of your pet to help potential adopters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Description Field - Full Width */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your pet" 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide details about your pet's personality, habits, and any special needs
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className="min-w-[120px]"
          >
            {(isSubmitting || isUploading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
} 