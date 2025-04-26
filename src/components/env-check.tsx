'use client'

import { env } from '@/lib/env'

export function EnvCheck() {
  return (
    <div className="text-sm text-muted-foreground">
      reCAPTCHA Site Key: {env.recaptcha.siteKey ? 'Loaded ✅' : 'Missing ❌'}
    </div>
  )
} 