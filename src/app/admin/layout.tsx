'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { 
  LogOutIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Navigation groups
const navigation = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: '/admin/dashboard' },
      { title: 'Agents', href: '/admin/agents' },
      { title: 'Transactions', href: '/admin/transactions' },
    ],
  },
  {
    title: 'Subscription & Billing',
    items: [
      { title: 'Subscription Plans', href: '/admin/subscription-plans' },
      { title: 'Billing & Payments', href: '/admin/billing' },
      { title: 'Refunds', href: '/admin/refunds' },
    ],
  },
  {
    title: 'Coverage & Data',
    items: [
      { title: 'Zip Codes', href: '/admin/zip-codes' },
      { title: 'Market Analysis', href: '/admin/market-analysis' },
      { title: 'Data Import', href: '/admin/data-import' },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Configuration', href: '/admin/system-config' },
      { title: 'Email Templates', href: '/admin/email-templates' },
      { title: 'API Settings', href: '/admin/api-settings' },
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'Support Tickets', href: '/admin/support-tickets' },
      { title: 'Announcements', href: '/admin/announcements' },
      { title: 'Help & Docs', href: '/admin/help' },
    ],
  },
  {
    title: 'Admin Management',
    items: [
      { title: 'Admin Users', href: '/admin/admin-users' },
      { title: 'System Health', href: '/admin/system-health' },
      { title: 'Audit Logs', href: '/admin/audit-logs' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Please sign in to access the admin dashboard.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex h-16 items-center border-b px-4">
              <span className="flex items-center gap-2 font-semibold">
                Roof Leads Pro
              </span>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                <XIcon className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-4">
                {navigation.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">{group.title}</h4>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                            pathname === item.href ? 'bg-accent' : 'transparent'
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <div className="flex w-64 flex-col border-r">
          <div className="flex h-16 items-center border-b px-4">
            <span className="flex items-center gap-2 font-semibold">
              Roof Leads Pro
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              {navigation.map((group) => (
                <div key={group.title} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{group.title}</h4>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                          pathname === item.href ? 'bg-accent' : 'transparent'
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-auto border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => signOut()}
            >
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 