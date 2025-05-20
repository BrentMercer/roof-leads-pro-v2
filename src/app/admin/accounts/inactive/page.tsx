'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InactiveAccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inactive Accounts</h1>
        <p className="text-muted-foreground">
          View and manage inactive accounts in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inactive Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Inactive accounts table will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 