import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | Adopt',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
} 