'use client';

import { Toaster as SonnerToaster } from 'sonner';

/**
 * Global toast provider using Sonner
 * 
 * Place this at the root layout to enable toast notifications
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'group bg-background text-foreground border-border shadow-lg rounded-md p-4 flex gap-3 items-start',
          title: 'text-sm font-semibold',
          description: 'text-sm opacity-90',
          actionButton: 'bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md',
          cancelButton: 'bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-md',
          closeButton: 'rounded-md',
          success: 'border-green-500 [&>div:first-child]:text-green-500',
          error: 'border-red-500 [&>div:first-child]:text-red-500',
          info: 'border-blue-500 [&>div:first-child]:text-blue-500',
          warning: 'border-yellow-500 [&>div:first-child]:text-yellow-500',
        },
      }}
    />
  );
} 