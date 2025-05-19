import { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = {
  title: 'Admin Login - Roof Leads Pro',
  description: 'Admin login page for Roof Leads Pro',
};

export default function AdminLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your admin credentials to access the dashboard
          </p>
        </div>
        <AdminLoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <a
            href="/"
            className="hover:text-brand underline underline-offset-4"
          >
            Return to main site
          </a>
        </p>
      </div>
    </div>
  );
} 