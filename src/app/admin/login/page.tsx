import { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = {
  title: 'Admin Login | Roof Leads Pro',
  description: 'Admin login for Roof Leads Pro',
};

export default function AdminLoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-muted-foreground">
          Sign in to access the admin dashboard
        </p>
      </div>
      <AdminLoginForm />
    </div>
  );
} 