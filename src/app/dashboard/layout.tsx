'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UserIcon, 
  MapPinIcon, 
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  BarChartIcon,
  FileTextIcon,
  BellIcon,
  HelpCircleIcon,
  UsersIcon,
  MailIcon,
  MapIcon
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { SessionTimeoutWarning } from '@/components/session/timeout-warning';

const navigation = [
  // Core Workflow
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'MLS Listings', href: '/dashboard/listings', icon: MapPinIcon },
  { name: 'Leads', href: '/dashboard/leads', icon: UsersIcon },
  { name: 'Outreach', href: '/dashboard/outreach', icon: MailIcon },
  
  // Coverage & Analysis
  { name: 'Coverage', href: '/dashboard/coverage', icon: MapIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChartIcon },
  { name: 'Reports', href: '/dashboard/reports', icon: FileTextIcon },
  
  // Account & Settings
  { name: 'Account', href: '/dashboard/account', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Help & Support', href: '/dashboard/help', icon: HelpCircleIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <SessionTimeoutWarning />
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-card">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex h-16 flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-foreground">Roof Leads Pro</h1>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-border bg-card">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-foreground">Roof Leads Pro</h1>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-border p-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LogOutIcon className="mr-3 h-5 w-5 flex-shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-card lg:hidden">
          <button
            type="button"
            className="px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 