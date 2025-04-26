'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Something went wrong!
            </h1>
            <p className="text-muted-foreground">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>
          <Button
            onClick={() => reset()}
            variant="outline"
            className="mt-4"
          >
            Try again
          </Button>
        </div>
      </body>
    </html>
  )
} 