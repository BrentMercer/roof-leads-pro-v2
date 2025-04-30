'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navigation = {
  main: [
    { name: 'Why Roof Leads Pro', href: '/why' },
    {
      name: 'Features',
      items: [
        { name: 'Lead Management', href: '/features/lead-management' },
        { name: 'MLS Integration', href: '/features/mls-integration' },
        { name: 'Market Analytics', href: '/features/market-analytics' },
        { name: 'ZIP Code Targeting', href: '/features/zip-targeting' },
      ],
    },
    {
      name: 'Solutions',
      items: [
        { name: 'Lead Generation', href: '/solutions/lead-generation' },
        { name: 'Market Analysis', href: '/solutions/market-analysis' },
        { name: 'Workflow Automation', href: '/solutions/workflow-automation' },
        { name: 'Data Security', href: '/solutions/data-security' },
      ],
    },
    { name: 'Pricing', href: '/pricing' },
    {
      name: 'Resources',
      items: [
        { name: 'Blog', href: '/resources/blog' },
        { name: 'Help Center', href: '/resources/help' },
        { name: 'API Documentation', href: '/resources/docs' },
      ],
    },
  ],
}

const solutions = [
  {
    title: 'Lead Generation',
    href: '/solutions/lead-generation',
    description: 'Automatically identify and target homeowners who need new roofs'
  },
  {
    title: 'Market Analysis',
    href: '/solutions/market-analysis',
    description: 'Get detailed insights into your target markets'
  },
  {
    title: 'Workflow Automation',
    href: '/solutions/workflow-automation',
    description: 'Streamline your sales process with automated tools'
  },
  {
    title: 'Data Security',
    href: '/solutions/data-security',
    description: 'Enterprise-grade protection for your data'
  }
]

const resources = [
  {
    title: 'Blog',
    href: '/blog',
    description: 'Latest news and insights'
  },
  {
    title: 'Help Center',
    href: '/help',
    description: 'Get support and answers'
  },
  {
    title: 'Documentation',
    href: '/docs',
    description: 'Technical guides and API docs'
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navigation.main.map((item) => (
        item.items ? (
          <DropdownMenu key={item.name}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {item.items.map((subItem) => (
                <DropdownMenuItem key={subItem.href} asChild>
                  <Link href={subItem.href}>
                    <div>
                      <div className="font-medium">{subItem.name}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href && "text-primary"
            )}
          >
            {item.name}
          </Link>
        )
      ))}
    </nav>
  )
} 