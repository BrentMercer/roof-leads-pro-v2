'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon, LockIcon, BellIcon, WebhookIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">John Doe</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">Not set</p>
            </div>
            <Button variant="outline" className="w-full">
              <UserIcon className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Password</p>
              <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Not enabled</p>
            </div>
            <Button variant="outline" className="w-full">
              <LockIcon className="mr-2 h-4 w-4" />
              Update Security Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">Enabled for all updates</p>
          </div>
          <Button variant="outline" className="w-full">
            <BellIcon className="mr-2 h-4 w-4" />
            Configure Notifications
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Connector</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Webhook URL</p>
            <p className="text-sm text-muted-foreground">Not configured</p>
          </div>
          <Button variant="outline" className="w-full">
            <WebhookIcon className="mr-2 h-4 w-4" />
            Configure Lead Connector
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 