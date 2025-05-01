import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Target, Search, Filter, Bell, Share2 } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const features = [
  {
    title: 'MLS Data Integration',
    description: 'Access real-time MLS data to identify properties that need new roofs.',
    icon: Search
  },
  {
    title: 'Smart Filtering',
    description: 'Filter leads by property age, condition, and other key factors.',
    icon: Filter
  },
  {
    title: 'Instant Notifications',
    description: 'Get notified immediately when new leads matching your criteria are found.',
    icon: Bell
  },
  {
    title: 'Lead Sharing',
    description: 'Easily share leads with your team members and track their progress.',
    icon: Share2
  }
]

export default function LeadGenerationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 pointer-events-none" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Lead Generation
              </h1>
              <p className="text-xl text-muted-foreground">
                Automatically identify and target homeowners who need new roofs based on real-time MLS data
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-6 rounded-lg border bg-card"
                >
                  <div className="flex-none">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Set Your Criteria",
                    description: "Define your target market by selecting ZIP codes and property characteristics."
                  },
                  {
                    step: "2",
                    title: "Automated Monitoring",
                    description: "Our system continuously monitors MLS data for properties matching your criteria."
                  },
                  {
                    step: "3",
                    title: "Instant Notifications",
                    description: "Get notified immediately when new leads are found that match your criteria."
                  },
                  {
                    step: "4",
                    title: "Lead Management",
                    description: "Track and manage your leads through our intuitive dashboard."
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="flex-none w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to generate more leads?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your free trial today and see how Roof Leads Pro can transform your business
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
} 