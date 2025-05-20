'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaletteIcon, LayoutIcon, GlobeIcon, FilterIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your dashboard and application preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Display Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <LayoutIcon className="h-5 w-5" />
              <CardTitle>Display Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Customize how information is displayed in your dashboard.</p>
              <p className="mt-2">Options will include:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Default View (Cards/List/Map)</li>
                <li>Items Per Page</li>
                <li>Date Format</li>
                <li>Time Zone</li>
                <li>Default Sort Order</li>
                <li>Column Visibility</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Theme & Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PaletteIcon className="h-5 w-5" />
              <CardTitle>Theme & Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Customize the look and feel of your dashboard.</p>
              <p className="mt-2">Settings will include:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Color Theme</li>
                <li>Dark/Light Mode</li>
                <li>Font Size</li>
                <li>Custom Branding</li>
                <li>Dashboard Layout</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FilterIcon className="h-5 w-5" />
              <CardTitle>Data Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Configure how data is filtered and displayed.</p>
              <p className="mt-2">Options will include:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Default Filters</li>
                <li>Saved Views</li>
                <li>Data Refresh Rate</li>
                <li>Export Preferences</li>
                <li>Custom Fields</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <GlobeIcon className="h-5 w-5" />
              <CardTitle>Regional Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Configure regional and localization settings.</p>
              <p className="mt-2">Settings will include:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Language</li>
                <li>Currency</li>
                <li>Measurement Units</li>
                <li>Date/Time Format</li>
                <li>Regional Filters</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 