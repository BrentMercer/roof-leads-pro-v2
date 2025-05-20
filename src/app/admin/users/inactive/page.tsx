'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InactiveUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inactive Users</h1>
        <p className="text-muted-foreground">
          View and manage inactive users in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inactive Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Inactive users table will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 