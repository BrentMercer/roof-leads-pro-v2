'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Accounts</h1>
        <p className="text-muted-foreground">
          View and manage all accounts in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Account table will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 