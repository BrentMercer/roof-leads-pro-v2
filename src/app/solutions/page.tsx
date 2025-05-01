import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Target, Zap, Shield, BarChart } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const solutions = [
  {
    title: 'Lead Generation',
    description: 'Automatically identify and target homeowners who need new roofs based on real-time MLS data.',
    icon: Target,
    href: '/solutions/lead-generation'
  },
  {
    title: 'Market Analysis',
    description: 'Get detailed insights into your target markets with comprehensive analytics and reporting.',
    icon: BarChart,
    href: '/solutions/market-analysis'
  },
  {
    title: 'Workflow Automation',
    description: 'Streamline your sales process with automated lead management and follow-up tools.',
    icon: Zap,
    href: '/solutions/workflow-automation'
  },
  {
    title: 'Data Security',
    description: 'Keep your MLS data and lead information secure with enterprise-grade protection.',
    icon: Shield,
    href: '/solutions/data-security'
  }
]

export default function SolutionsPage() {
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
                Solutions for Roofing Professionals
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover how Roof Leads Pro can transform your roofing business with powerful tools and insights
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              {solutions.map((solution) => (
                <div
                  key={solution.title}
                  className="group relative rounded-lg border bg-card p-8 hover:border-primary transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-none">
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <solution.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                      <p className="text-muted-foreground mb-4">{solution.description}</p>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <Link href={solution.href}>
                          Learn more
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/50">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to transform your business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your free trial today and see the difference Roof Leads Pro can make
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