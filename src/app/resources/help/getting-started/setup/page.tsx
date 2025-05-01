import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, User, MapPin } from 'lucide-react'

const steps = [
  {
    title: 'Create Your Account',
    description: 'Start by creating your Roof Leads Pro account. You can sign up using your email address or Google account.',
    icon: User,
    details: [
      'Click the "Get Started" button on our homepage',
      'Enter your email address and create a password',
      'Or click "Continue with Google" for quick signup',
      'Verify your email address to activate your account'
    ]
  },
  {
    title: 'Complete Your Profile',
    description: 'Set up your business profile to get started with Roof Leads Pro.',
    icon: CheckCircle2,
    details: [
      'Enter your business name and contact information',
      'Add your business address and service areas',
      'Upload your business logo (optional)',
      'Set your notification preferences'
    ]
  },
  {
    title: 'Choose Your Plan',
    description: 'Select the plan that best fits your business needs.',
    icon: MapPin,
    details: [
      'Review the available pricing tiers',
      'Select the number of ZIP codes you need',
      'Choose your billing cycle (monthly or annual)',
      'Enter your payment information'
    ]
  },
  {
    title: 'Set Up Your First ZIP Code',
    description: 'Add your first target area to start receiving leads.',
    icon: MapPin,
    details: [
      'Go to Settings > ZIP Codes',
      'Enter the ZIP code you want to target',
      'Set your lead preferences for this area',
      'Save your settings and start receiving leads'
    ]
  }
]

const tips = [
  {
    title: 'Use a Business Email',
    description: 'We recommend using a business email address for your account to ensure you receive all important notifications.'
  },
  {
    title: 'Choose ZIP Codes Wisely',
    description: 'Start with your primary service area and expand as your business grows. You can always add more ZIP codes later.'
  },
  {
    title: 'Set Up Notifications',
    description: 'Configure your notification preferences early to ensure you don\'t miss any important leads or updates.'
  }
]

export default function SetupGuidePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Setting Up Your Account
            </h1>
            <p className="text-xl text-muted-foreground">
              A step-by-step guide to getting started with Roof Leads Pro
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-6"
              >
                <div className="flex-none">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <step.icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">Step {index + 1}</span>
                    <h2 className="text-2xl font-semibold">{step.title}</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-none" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pro Tips
          </h2>
          <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-3">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="rounded-lg border bg-card p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                <p className="text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create your account and start finding roofing leads today
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 