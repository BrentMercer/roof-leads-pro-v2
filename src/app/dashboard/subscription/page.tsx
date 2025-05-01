'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, CreditCardIcon } from 'lucide-react';

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and zip codes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Plan</p>
                <p className="text-2xl font-bold">Free Trial</p>
              </div>
              <Button variant="outline">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Billing Cycle</p>
              <p className="text-sm text-muted-foreground">Monthly</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Next Billing Date</p>
              <p className="text-sm text-muted-foreground">Not applicable</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zip Code Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Zip Codes</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Button variant="outline">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Zip Codes
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Zip Codes</p>
              <p className="text-sm text-muted-foreground">
                No zip codes added yet
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No subscription history available
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 