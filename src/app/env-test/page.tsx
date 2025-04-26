'use client'

export default function EnvTestPage() {
  return (
    <div className="p-4">
      <h1>Environment Variables Test</h1>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify({
          NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          NODE_ENV: process.env.NODE_ENV,
        }, null, 2)}
      </pre>
    </div>
  )
} 