import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, BarChart, TrendingUp, Map, Target, PieChart } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const features = [
  {
    title: 'Market Trends',
    description: 'Track market trends and identify growth opportunities in your target areas.',
    icon: TrendingUp
  },
  {
    title: 'Geographic Analysis',
    description: 'Visualize market data on interactive maps to identify high-potential areas.',
    icon: Map
  },
  {
    title: 'Competitor Insights',
    description: 'Analyze competitor activity and market share in your target regions.',
    icon: Target
  },
  {
    title: 'Performance Metrics',
    description: 'Measure and track key performance indicators with detailed analytics.',
    icon: PieChart
  }
]

export default function MarketAnalysisPage() {
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
                <BarChart className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Market Analysis
              </h1>
              <p className="text-xl text-muted-foreground">
                Get detailed insights into your target markets with comprehensive analytics and reporting
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
                    title: "Data Collection",
                    description: "Gather comprehensive market data from multiple sources including MLS, public records, and market trends."
                  },
                  {
                    step: "2",
                    title: "Analysis",
                    description: "Process and analyze the data to identify patterns, trends, and opportunities in your target markets."
                  },
                  {
                    step: "3",
                    title: "Visualization",
                    description: "Present the data in easy-to-understand charts, graphs, and maps for better decision making."
                  },
                  {
                    step: "4",
                    title: "Reporting",
                    description: "Generate detailed reports and insights to help you make informed business decisions."
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
              Ready to analyze your market?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your free trial today and gain valuable market insights
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
} 