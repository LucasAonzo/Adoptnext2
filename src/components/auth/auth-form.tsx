'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/use-auth';
import { signInSchema, signUpSchema } from '@/lib/validations/auth';
import { useState } from 'react';
import { toast } from 'sonner';

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export function AuthForm({ mode, onToggleMode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, signUp, isLoading } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      if (mode === 'sign-up') {
        const result = signUpSchema.safeParse({ email, password, name });
        if (!result.success) {
          const formattedErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            formattedErrors[issue.path[0]] = issue.message;
          });
          setErrors(formattedErrors);
          return;
        }

        const success = await signUp(email, password, name);
        if (success) {
          onSuccess?.();
        }
      } else {
        const result = signInSchema.safeParse({ email, password });
        if (!result.success) {
          const formattedErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            formattedErrors[issue.path[0]] = issue.message;
          });
          setErrors(formattedErrors);
          return;
        }

        const success = await signIn(email, password);
        if (success) {
          onSuccess?.();
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'sign-in' ? 'Sign In' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'sign-in'
            ? 'Enter your email and password to sign in'
            : 'Create a new account to get started'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === 'sign-up' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? 'Loading...'
              : mode === 'sign-in'
              ? 'Sign In'
              : 'Create Account'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onToggleMode}
          >
            {mode === 'sign-in'
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 