'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActiveAccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Active Accounts</h1>
        <p className="text-muted-foreground">
          View and manage active accounts in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Active accounts table will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 