import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, List, Filter, Bell, BarChart } from 'lucide-react'

export default function LeadManagementPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Lead Management
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Streamline your lead management process with our powerful tools and automation
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 mt-16 md:grid-cols-2">
        <div className="bg-card rounded-lg border p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <List className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Centralized Lead Dashboard</h3>
          <p className="text-muted-foreground">
            View and manage all your leads in one place. Sort, filter, and track progress through your sales pipeline.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Lead Scoring</h3>
          <p className="text-muted-foreground">
            Automatically score and prioritize leads based on property data, owner information, and engagement metrics.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Automated Notifications</h3>
          <p className="text-muted-foreground">
            Get instant alerts when new leads match your criteria or when it's time to follow up with existing leads.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <BarChart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
          <p className="text-muted-foreground">
            Track conversion rates, response times, and other key metrics to optimize your lead management process.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Our Lead Management</h2>
        <div className="space-y-6">
          {[
            {
              title: "Save Time with Automation",
              description: "Automate lead scoring, follow-ups, and notifications to focus on what matters most - closing deals."
            },
            {
              title: "Never Miss an Opportunity",
              description: "Our system ensures no lead falls through the cracks with intelligent tracking and reminders."
            },
            {
              title: "Data-Driven Decisions",
              description: "Make informed decisions with comprehensive analytics and reporting on your lead generation efforts."
            }
          ].map((benefit) => (
            <div key={benefit.title} className="flex gap-4">
              <div className="flex-none">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to transform your lead management?
        </h2>
        <Button size="lg" asChild>
          <Link href="/register">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
} 