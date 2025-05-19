'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // If we're on the login page, don't show the admin layout
  if (pathname === '/admin/login') {
    return children;
  }

  // If not authenticated, redirect to login
  if (status === 'unauthenticated') {
    router.push('/admin/login');
    return null;
  }

  // If not an admin, redirect to home
  if (session?.user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
            onClick={() => router.push('/admin')}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
            onClick={() => router.push('/admin/leads')}
          >
            Leads
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
            onClick={() => router.push('/admin/users')}
          >
            Users
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
            onClick={() => router.push('/admin/settings')}
          >
            Settings
          </Button>
        </nav>
        <div className="mt-auto pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
} 