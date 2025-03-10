'use client';

import { UserProfile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Mail, MapPin, Phone, User } from 'lucide-react';
import Link from 'next/link';

interface UserProfileCardProps {
  profile: UserProfile | null;
  isLoading?: boolean;
}

export function UserProfileCard({ profile, isLoading = false }: UserProfileCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
          <CardDescription>
            We couldn't find your profile information. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
        <CardDescription>Your personal information and account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Name</span>
          </div>
          <p className="text-base font-medium">
            {profile.name || 'Not provided'}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </div>
          <p className="text-base font-medium">{profile.email}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>Phone</span>
          </div>
          <p className="text-base font-medium">
            {profile.phone || 'Not provided'}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Address</span>
          </div>
          <p className="text-base font-medium">
            {profile.address || 'Not provided'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/profile/edit" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 