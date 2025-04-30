import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Database, RefreshCw, Shield, Search } from 'lucide-react'

export default function MLSIntegrationPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          MLS Integration
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Access real-time MLS data to identify potential roofing opportunities and stay ahead of the competition
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 mt-16 md:grid-cols-2">
        <div className="bg-card rounded-lg border p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Direct MLS Access</h3>
          <p className="text-muted-foreground">
            Connect directly to your local MLS system for real-time property data and market insights.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Automated Updates</h3>
          <p className="text-muted-foreground">
            Stay current with automatic synchronization of new listings, price changes, and property updates.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Data Handling</h3>
          <p className="text-muted-foreground">
            Industry-standard security protocols ensure your MLS data is protected and compliant with regulations.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
          <p className="text-muted-foreground">
            Powerful search capabilities to filter properties by age, condition, and other relevant criteria.
          </p>
        </div>
      </div>

      {/* Integration Process */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Simple Integration Process</h2>
        <div className="space-y-12">
          {[
            {
              step: "1",
              title: "Connect Your MLS",
              description: "Provide your MLS credentials and we'll handle the setup process."
            },
            {
              step: "2",
              title: "Configure Preferences",
              description: "Set your preferred search criteria and notification settings."
            },
            {
              step: "3",
              title: "Start Generating Leads",
              description: "Begin receiving targeted leads based on your specifications."
            }
          ].map((step) => (
            <div key={step.title} className="flex gap-6">
              <div className="flex-none">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {step.step}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to access powerful MLS data?
        </h2>
        <Button size="lg" asChild>
          <Link href="/register">
            Start Integration
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
} 