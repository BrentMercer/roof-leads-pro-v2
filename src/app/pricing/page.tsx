import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const pricingTiers = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfect for small roofing businesses',
    features: [
      'Up to 3 ZIP codes',
      'Basic lead management',
      'Email notifications',
      'Standard support',
      'Basic analytics',
      'Mobile access'
    ],
    cta: 'Start Free Trial'
  },
  {
    name: 'Professional',
    price: 99,
    description: 'For growing roofing companies',
    features: [
      'Up to 10 ZIP codes',
      'Advanced lead management',
      'Priority support',
      'Custom reports',
      'API access',
      'Team collaboration',
      'Advanced analytics',
      'Bulk lead export'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For large roofing organizations',
    features: [
      'Unlimited ZIP codes',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options',
      'Advanced API access',
      'Custom reporting',
      'Training sessions',
      'SLA guarantees'
    ],
    cta: 'Contact Sales'
  }
]

export default function PricingPage() {
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
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground">
                Choose the plan that best fits your roofing business needs
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-lg border bg-card p-8 ${
                    tier.popular ? 'border-primary shadow-lg' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-muted-foreground mb-4">{tier.description}</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${tier.price}</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    className="w-full"
                    variant={tier.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={tier.name === 'Enterprise' ? '/contact' : '/register'}>
                      {tier.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  question: "What's included in the free trial?",
                  answer: "The free trial includes access to all features of your chosen plan for 14 days. No credit card required."
                },
                {
                  question: "Can I change plans later?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  question: "How does ZIP code pricing work?",
                  answer: "Each plan includes a set number of ZIP codes. You can add or remove ZIP codes as needed, with pricing adjusted accordingly."
                },
                {
                  question: "Is there a contract?",
                  answer: "No, all plans are month-to-month with no long-term commitment. You can cancel anytime."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-background rounded-lg p-6 border">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Still have questions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our team is here to help you choose the right plan for your business
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
} 