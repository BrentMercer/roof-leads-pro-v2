import { Metadata } from 'next';
import { DashboardContent } from '@/components/admin/dashboard-content';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Roof Leads Pro',
  description: 'Admin dashboard for managing Roof Leads Pro',
};

export default function AdminDashboardPage() {
  return <DashboardContent />;
} 