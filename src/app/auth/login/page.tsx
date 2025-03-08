import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Adopt',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <LoginForm />
      </div>
    </div>
  );
} 