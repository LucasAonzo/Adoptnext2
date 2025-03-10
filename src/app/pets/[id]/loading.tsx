import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PetDetailLoading() {
  return (
    <div className="pb-16 bg-slate-50 dark:bg-slate-950/20">
      {/* Back Button */}
      <div className="container py-4">
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-black/10">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="container relative z-20 pt-4 pb-6 md:pb-8 lg:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
            {/* Main Pet Image */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-xl shadow-xl">
                <Skeleton className="aspect-[4/3] md:aspect-[16/9] w-full h-full" />
                <div className="absolute top-4 left-4 z-20">
                  <Skeleton className="h-6 w-36 rounded-full" />
                </div>
              </div>
            </div>

            {/* Pet Introduction */}
            <div className="flex flex-col justify-center">
              <Skeleton className="h-12 w-3/4 mb-2" />
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full rounded-full" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-full rounded-full" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-10">
            <div>
              <Skeleton className="h-10 w-full rounded-md mb-6" /> {/* Tabs */}
              
              <div className="space-y-6 pt-6">
                <div>
                  <Skeleton className="h-8 w-40 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-7 w-32 mb-4" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
                
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
            <Skeleton className="h-72 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
} 