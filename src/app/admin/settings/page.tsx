import { Metadata } from 'next';
import { SettingsForm } from '@/components/admin/settings-form';

export const metadata: Metadata = {
  title: 'Settings | Roof Leads Pro Admin',
  description: 'Manage system settings and configuration',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage system settings and configuration
        </p>
      </div>
      <SettingsForm />
    </div>
  );
} 