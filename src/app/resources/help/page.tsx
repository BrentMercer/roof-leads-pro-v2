import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Search, BookOpen, MessageSquare, Mail } from 'lucide-react'

const categories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of Roof Leads Pro',
    guides: [
      {
        title: 'Setting Up Your Account',
        href: '/resources/help/getting-started/setup'
      },
      {
        title: 'Understanding Your Dashboard',
        href: '/resources/help/getting-started/dashboard'
      },
      {
        title: 'Adding Your First ZIP Code',
        href: '/resources/help/getting-started/zip-codes'
      }
    ]
  },
  {
    title: 'Lead Management',
    description: 'Manage and track your roofing leads',
    guides: [
      {
        title: 'Viewing and Filtering Leads',
        href: '/resources/help/leads/viewing'
      },
      {
        title: 'Exporting Lead Data',
        href: '/resources/help/leads/exporting'
      },
      {
        title: 'Setting Up Lead Notifications',
        href: '/resources/help/leads/notifications'
      }
    ]
  },
  {
    title: 'MLS Integration',
    description: 'Work with MLS data effectively',
    guides: [
      {
        title: 'Understanding MLS Data',
        href: '/resources/help/mls/understanding'
      },
      {
        title: 'Setting Up MLS Filters',
        href: '/resources/help/mls/filters'
      },
      {
        title: 'Troubleshooting MLS Issues',
        href: '/resources/help/mls/troubleshooting'
      }
    ]
  }
]

const faqs = [
  {
    question: 'How do I add more ZIP codes to my subscription?',
    answer: 'You can add more ZIP codes through your account settings. Navigate to Settings > Subscription and click "Add ZIP Codes". You\'ll be able to see pricing and add new ZIP codes to your plan.'
  },
  {
    question: 'How often is MLS data updated?',
    answer: 'Our system updates MLS data in real-time, ensuring you have the most current information about properties in your target areas.'
  },
  {
    question: 'Can I export my lead data?',
    answer: 'Yes, you can export your lead data in CSV format. This feature is available in the Lead Management section of your dashboard.'
  },
  {
    question: 'How do I set up email notifications?',
    answer: 'You can configure email notifications in your account settings. Go to Settings > Notifications to set up your preferences for new leads and other important updates.'
  }
]

export default function HelpCenterPage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions and learn how to use Roof Leads Pro effectively
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.title}
                className="rounded-lg border bg-card p-6"
              >
                <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.guides.map((guide) => (
                    <li key={guide.href}>
                      <Link
                        href={guide.href}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="h-4 w-4" />
                        {guide.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our support team is here to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild>
                <Link href="mailto:support@roofleadspro.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 