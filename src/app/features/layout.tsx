import { SiteHeader } from '@/components/site-header'

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1">
        <div className="container py-10">
          {children}
        </div>
      </div>
    </div>
  )
} 