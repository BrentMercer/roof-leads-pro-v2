'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, CreditCardIcon, ShieldIcon, BellIcon } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <CardTitle>Personal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Name, email, phone number, and company information will be managed here.</p>
              <p className="mt-2">Form will include:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Company Name</li>
                <li>Business Address</li>
                <li>Business Phone</li>
                <li>Website</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCardIcon className="h-5 w-5" />
              <CardTitle>Subscription & Billing</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Manage your subscription plan and billing information.</p>
              <p className="mt-2">Features will include:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Current Plan Details</li>
                <li>Billing History</li>
                <li>Payment Methods</li>
                <li>Upgrade/Downgrade Options</li>
                <li>Zip Code Management</li>
                <li>Invoices & Receipts</li>
                <li>Cancel Subscription</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShieldIcon className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Manage your account security settings.</p>
              <p className="mt-2">Options will include:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Change Password</li>
                <li>Two-Factor Authentication</li>
                <li>Login History</li>
                <li>Active Sessions</li>
                <li>API Keys</li>
                <li>Webhook Settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BellIcon className="h-5 w-5" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Configure how you receive notifications.</p>
              <p className="mt-2">Settings will include:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Email Notifications</li>
                <li>SMS Notifications</li>
                <li>New Lead Alerts</li>
                <li>System Updates</li>
                <li>Billing Notifications</li>
                <li>Weekly Reports</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 