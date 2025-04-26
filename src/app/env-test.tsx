'use client'

export default function EnvTest() {
  return (
    <div className="p-4">
      <h2>Environment Variables Test</h2>
      <pre className="bg-gray-100 p-4 mt-4 rounded">
        {JSON.stringify({
          NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          NODE_ENV: process.env.NODE_ENV,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        }, null, 2)}
      </pre>
    </div>
  )
} 