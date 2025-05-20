'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing Settings</h1>
        <p className="text-muted-foreground">
          Configure billing and payment settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Payment gateway configuration form will be implemented here
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Invoice configuration form will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 