'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function DashboardContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          Log Out
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Leads</h2>
          <p className="text-gray-600">View and manage lead data</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-gray-600">Configure system settings</p>
        </div>
      </div>
    </div>
  );
} 