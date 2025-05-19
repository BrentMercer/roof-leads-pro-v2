import { Metadata } from 'next';
import { UsersTable } from '@/components/admin/users-table';

export const metadata: Metadata = {
  title: 'Users Management | Roof Leads Pro',
  description: 'Manage users and their subscriptions',
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          Manage users and their subscription status
        </p>
      </div>
      <UsersTable />
    </div>
  );
} 