import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

const articles = [
  {
    title: 'How to Identify Roofing Opportunities in Your Market',
    excerpt: 'Learn the key indicators that help identify properties in need of roof replacement.',
    date: '2024-03-15',
    readTime: '5 min read',
    category: 'Market Analysis'
  },
  {
    title: 'Best Practices for Lead Management in Roofing',
    excerpt: 'Discover effective strategies for managing and converting roofing leads.',
    date: '2024-03-10',
    readTime: '7 min read',
    category: 'Lead Generation'
  },
  {
    title: 'Understanding MLS Data for Roofing Businesses',
    excerpt: 'A comprehensive guide to leveraging MLS data for your roofing business.',
    date: '2024-03-05',
    readTime: '8 min read',
    category: 'Data Insights'
  },
  {
    title: 'Automating Your Roofing Sales Process',
    excerpt: 'Learn how automation can streamline your roofing sales workflow.',
    date: '2024-02-28',
    readTime: '6 min read',
    category: 'Workflow'
  }
]

export default function BlogPage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Latest insights and best practices for roofing professionals
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            {articles.map((article) => (
              <article
                key={article.title}
                className="group relative rounded-lg border bg-card p-6 hover:border-primary transition-colors"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={article.date}>
                          {new Date(article.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground">{article.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {article.category}
                    </span>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <Link href={`/resources/blog/${article.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        Read more
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest roofing industry insights
            </p>
            <form className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
} 