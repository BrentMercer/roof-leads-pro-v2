import { getMLSToken } from './mls-auth'
import type { MLSTransaction } from './types/mls'

const MLS_API_URL = 'https://retsapi.raprets.com/2/lab_lbk/RESO/OData'

export async function fetchMLSData() {
  const token = await getMLSToken()
  
  const [active, underContract, closed] = await Promise.all([
    fetchStatus(token, 'Active'),
    fetchStatus(token, 'Under Contract'),
    fetchStatus(token, 'Closed')
  ])

  return {
    Active: active,
    UnderContract: underContract,
    Closed: closed
  }
}

async function fetchStatus(token: string, status: string): Promise<MLSTransaction[]> {
  const response = await fetch(`${MLS_API_URL}/Property?$filter=StandardStatus eq '${status}'`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${status} listings: ${response.statusText}`)
  }

  const data = await response.json()
  return data.value as MLSTransaction[]
} 