import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Target, Zap, Shield, BarChart } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export default function WhyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 pointer-events-none" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Why Choose Roof Leads Pro?
              </h1>
              <p className="text-xl text-muted-foreground">
                Transform your roofing business with data-driven lead generation and management
              </p>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-none">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Target className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Precision Targeting</h3>
                    <p className="text-muted-foreground mt-2">
                      Identify properties that actually need roofing services based on real-time MLS data and property condition analysis.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Time Efficiency</h3>
                    <p className="text-muted-foreground mt-2">
                      Automate lead generation and management, allowing you to focus on closing deals rather than finding leads.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Shield className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Data Security</h3>
                    <p className="text-muted-foreground mt-2">
                      Your MLS data and lead information are protected with enterprise-grade security measures.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BarChart className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">ROI Focused</h3>
                    <p className="text-muted-foreground mt-2">
                      Track your investment with detailed analytics and reporting on lead generation and conversion rates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">The Roof Leads Pro Advantage</h2>
                <div className="space-y-6">
                  {[
                    "Direct MLS integration for real-time property data",
                    "Automated lead scoring and prioritization",
                    "Customizable search criteria for targeted leads",
                    "Comprehensive analytics and reporting",
                    "Mobile-friendly interface for on-the-go access",
                    "Dedicated support team for setup and training"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-none mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote: "Roof Leads Pro has transformed how we find and manage leads. Our conversion rate has increased by 40%.",
                  author: "John Smith",
                  role: "Owner, Smith Roofing"
                },
                {
                  quote: "The MLS integration saves us countless hours of manual research. It's a game-changer for our business.",
                  author: "Sarah Johnson",
                  role: "Sales Manager, Johnson Roofing"
                },
                {
                  quote: "The lead scoring system helps us focus on the most promising opportunities. Highly recommended!",
                  author: "Mike Williams",
                  role: "CEO, Williams Contracting"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-background rounded-lg p-6 border">
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of roofing professionals who are already using Roof Leads Pro
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
} 