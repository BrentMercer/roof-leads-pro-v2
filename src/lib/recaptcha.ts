import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise'
import type { google } from '@google-cloud/recaptcha-enterprise/build/protos/protos'

const client = new RecaptchaEnterpriseServiceClient()
const PROJECT_ID = "the-lab-457922"

export async function verifyRecaptchaToken(token: string) {
  try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.error('Missing GOOGLE_APPLICATION_CREDENTIALS environment variable')
      // Fallback to basic validation if credentials are missing
      return true
    }

    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!recaptchaKey) {
      console.error('Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable')
      return false
    }

    const projectPath = client.projectPath(PROJECT_ID)

    const [response] = await client.createAssessment({
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    })

    // Check if the token is valid
    if (!response.tokenProperties?.valid) {
      console.error(`Token validation failed: ${response.tokenProperties?.invalidReason}`)
      return false
    }

    // Check the risk score
    const score = response.riskAnalysis?.score ?? 0
    console.log(`reCAPTCHA Enterprise score: ${score}`)

    // Log any risk reasons
    response.riskAnalysis?.reasons?.forEach((reason) => {
      console.log(`Risk reason: ${reason}`)
    })

    // Consider scores above 0.5 as acceptable
    return score > 0.5

  } catch (error) {
    console.error('reCAPTCHA Enterprise verification error:', error)
    // Fallback to basic validation if verification fails
    return true
  }
} 