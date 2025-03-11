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
import { cn } from '@/lib/utils';

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
      <Card className="w-full shadow-md">
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
    <Card className={cn(
      "w-full transition-all duration-300",
      "hover:shadow-lg hover:border-primary/10"
    )}>
      <CardHeader className="border-b border-border/10 bg-gradient-to-b from-card/50 to-card">
        <CardTitle className="text-2xl font-bold text-foreground/90">My Profile</CardTitle>
        <CardDescription className="text-muted-foreground leading-relaxed">
          Your personal information and account settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 py-5">
        <div className="space-y-2 group">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4 text-primary" />
            <span>Name</span>
          </div>
          <p className="text-base font-medium pl-6 group-hover:text-primary transition-colors duration-200">
            {profile.name || 'Not provided'}
          </p>
        </div>
        
        <div className="space-y-2 group">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" />
            <span>Email</span>
          </div>
          <p className="text-base font-medium pl-6 group-hover:text-primary transition-colors duration-200">
            {profile.email}
          </p>
        </div>
        
        <div className="space-y-2 group">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" />
            <span>Phone</span>
          </div>
          <p className="text-base font-medium pl-6 group-hover:text-primary transition-colors duration-200">
            {profile.phone || 'Not provided'}
          </p>
        </div>
        
        <div className="space-y-2 group">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Address</span>
          </div>
          <p className="text-base font-medium pl-6 group-hover:text-primary transition-colors duration-200">
            {profile.address || 'Not provided'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-border/10 bg-muted/5 px-6 py-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          asChild
        >
          <Link href="/profile/edit">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 