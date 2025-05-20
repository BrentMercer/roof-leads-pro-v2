'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActiveUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Active Users</h1>
        <p className="text-muted-foreground">
          View and manage active users in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Active users table will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 