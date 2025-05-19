import { Metadata } from 'next';
import { LeadsTable } from '@/components/admin/leads-table';

export const metadata: Metadata = {
  title: 'Lead Management | Roof Leads Pro Admin',
  description: 'Manage and monitor leads in Roof Leads Pro',
};

export default function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Lead Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all leads in the system
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <LeadsTable />
      </div>
    </div>
  );
} 