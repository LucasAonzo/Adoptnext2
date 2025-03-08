import { RegisterForm } from '@/components/auth/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | Adopt',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <RegisterForm />
      </div>
    </div>
  );
} 