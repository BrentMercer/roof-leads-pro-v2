import Link from 'next/link';
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">Roof Leads Pro</span>
            <span className="block text-primary">Data-Driven Roofing Leads</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Transform your roofing business with our AI-powered lead generation platform.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-card-foreground">Lead Management</h3>
            <p className="mt-2 text-muted-foreground">Track and manage leads efficiently with our intuitive dashboard.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-card-foreground">MLS Integration</h3>
            <p className="mt-2 text-muted-foreground">Access real-time MLS data to identify potential roofing opportunities.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-card-foreground">Analytics</h3>
            <p className="mt-2 text-muted-foreground">Make data-driven decisions with comprehensive analytics and reporting.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 