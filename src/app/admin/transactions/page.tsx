'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Transactions</h1>
        <p className="text-muted-foreground">
          View and manage all transactions in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Transactions table will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 