'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPinIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import { ZipCodeManager } from '@/components/zip-code-manager';

interface DashboardData {
  metrics: {
    activeZipCodes: number;
    newLeads: number;
    subscriptionStatus: string;
    webhookStatus: string;
  };
  recentActivity: Array<{
    action: string;
    date: string;
    details?: {
      name?: string;
      price?: number;
      billingCycle?: string;
      zipCodeCount?: number;
    };
  }>;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZipCodeManagerOpen, setIsZipCodeManagerOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back{data.user.name ? `, ${data.user.name}` : ''}! Here's what's happening with your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Zip Codes</CardTitle>
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.activeZipCodes}</div>
            <p className="text-xs text-muted-foreground">
              {data.metrics.activeZipCodes === 0 ? 'No zip codes assigned yet' : 'Zip codes in your subscription'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.newLeads}</div>
            <p className="text-xs text-muted-foreground">
              {data.metrics.newLeads === 0 ? 'No new leads in the last 24 hours' : 'New leads in the last 24 hours'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.subscriptionStatus}</div>
            <p className="text-xs text-muted-foreground">
              {data.metrics.subscriptionStatus === 'ACTIVE' ? 'Your subscription is active' : 'No active subscription'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhook Status</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.webhookStatus}</div>
            <p className="text-xs text-muted-foreground">
              {data.metrics.webhookStatus === 'Configured' ? 'Lead connector is set up' : 'Lead connector not set up'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => setIsZipCodeManagerOpen(true)}
            >
              <MapPinIcon className="mr-2 h-4 w-4" />
              Add Zip Codes
            </Button>
            <Button variant="outline" className="justify-start">
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              View MLS Listings
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertTriangleIcon className="mr-2 h-4 w-4" />
              Configure Lead Connector
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No recent activity to display
                </div>
              ) : (
                data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{formatAction(activity.action)}</p>
                      {activity.details && (
                        <p className="text-muted-foreground">
                          {activity.details.name}
                          {activity.details.zipCodeCount && ` - ${activity.details.zipCodeCount} zip codes`}
                        </p>
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {formatDate(activity.date)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ZipCodeManager
        isOpen={isZipCodeManagerOpen}
        onClose={() => setIsZipCodeManagerOpen(false)}
        onUpdate={fetchDashboardData}
      />
    </div>
  );
} 