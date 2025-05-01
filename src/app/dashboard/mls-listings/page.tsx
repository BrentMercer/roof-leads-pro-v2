'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchIcon, FilterIcon, DownloadIcon } from 'lucide-react';

export default function MLSListingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">MLS Listings</h1>
        <p className="text-muted-foreground">
          View and manage your MLS listings data.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No listings available. Please add zip codes to your subscription to view MLS data.
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 