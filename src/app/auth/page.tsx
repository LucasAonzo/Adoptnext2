'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm
          mode={mode}
          onToggleMode={() =>
            setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'))
          }
          onSuccess={() => {
            router.push(redirectPath);
          }}
        />
      </div>
    </div>
  );
} 