'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FailedTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Failed Transactions</h1>
        <p className="text-muted-foreground">
          View and manage failed transactions in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Failed Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Failed transactions table will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 