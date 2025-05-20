'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="text-muted-foreground">
          View and manage subscription plans and pricing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Subscription plans table will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 