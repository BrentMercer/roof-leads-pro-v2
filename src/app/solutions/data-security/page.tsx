import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Shield, Lock, Key, EyeOff, Server } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const features = [
  {
    title: 'Data Encryption',
    description: 'All data is encrypted both in transit and at rest using industry-standard protocols.',
    icon: Lock
  },
  {
    title: 'Access Control',
    description: 'Granular access controls ensure only authorized users can access sensitive data.',
    icon: Key
  },
  {
    title: 'Privacy Protection',
    description: 'Strict privacy controls protect homeowner and property information.',
    icon: EyeOff
  },
  {
    title: 'Secure Infrastructure',
    description: 'Enterprise-grade security infrastructure with regular security audits.',
    icon: Server
  }
]

export default function DataSecurityPage() {
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
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Data Security
              </h1>
              <p className="text-xl text-muted-foreground">
                Keep your MLS data and lead information secure with enterprise-grade protection
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

        {/* Security Measures */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Security Measures
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Data Encryption",
                    description: "All data is encrypted using AES-256 encryption, both in transit and at rest."
                  },
                  {
                    step: "2",
                    title: "Regular Audits",
                    description: "Regular security audits and penetration testing to identify and fix vulnerabilities."
                  },
                  {
                    step: "3",
                    title: "Compliance",
                    description: "Compliant with industry standards and regulations for data protection."
                  },
                  {
                    step: "4",
                    title: "Backup & Recovery",
                    description: "Regular backups and disaster recovery procedures to ensure data availability."
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
              Ready to secure your data?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your free trial today and protect your business data
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