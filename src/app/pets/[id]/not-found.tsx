import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function PetNotFound() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-16 w-16 text-gray-400" />
        <h1 className="text-3xl font-bold">Pet Not Found</h1>
        <p className="text-muted-foreground">
          The pet you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/pets"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Back to Pets
        </Link>
      </div>
    </div>
  );
} 