import { connectDB } from '../lib/mongodb'
import { Agent } from '../lib/models/agent'
import { Transaction } from '../lib/models/transaction'
import type { MLSTransaction, MLSAgent } from '../lib/types/mls'

async function getMLSToken() {
  const response = await fetch('https://retsidentityapi.raprets.com/lab_lbk/oauth/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      response_type: 'code',
      client_id: 'lab_lbk',
      redirect_uri: 'http://localhost:3000/api/auth/mls/callback'
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to get MLS token: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

async function fetchAllListings(token: string) {
  console.log('Fetching all listings...')
  const response = await fetch('http://localhost:3000/api/mls/listings', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.statusText}`)
  }

  const data = await response.json()
  return data.listings
}

async function fetchAllAgents(token: string) {
  console.log('Fetching all agents...')
  const response = await fetch('http://localhost:3000/api/mls/agents', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch agents: ${response.statusText}`)
  }

  const data = await response.json()
  return data.agents
}

async function importAgents(agents: MLSAgent[]) {
  console.log(`Importing ${agents.length} agents...`)
  let created = 0
  let updated = 0

  for (const agent of agents) {
    try {
      const result = await Agent.findOneAndUpdate(
        { memberKey: agent.MemberKey },
        {
          memberKey: agent.MemberKey,
          memberKeyNumeric: agent.MemberKeyNumeric,
          memberMlsId: agent.MemberMlsId,
          firstName: agent.MemberFirstName,
          lastName: agent.MemberLastName,
          fullName: agent.MemberFullName,
          email: agent.MemberEmail,
          phone: agent.PreferredPhone,
          officeName: agent.OfficeName,
          stateLicense: agent.MemberStateLicense,
          officeMlsId: agent.OfficeMlsId,
          officeKeyNumeric: agent.OfficeKeyNumeric,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      )

      if (result) {
        result.createdAt?.getTime() === result.updatedAt?.getTime() ? created++ : updated++
      }

      // Log progress every 100 agents
      if ((created + updated) % 100 === 0) {
        console.log(`Processed ${created + updated} agents...`)
      }
    } catch (error) {
      console.error(`Failed to import agent ${agent.MemberKey}:`, error)
    }
  }

  return { created, updated }
}

async function importListings(listings: MLSTransaction[]) {
  console.log(`Importing ${listings.length} listings...`)
  let created = 0
  let updated = 0

  for (const listing of listings) {
    try {
      const result = await Transaction.findOneAndUpdate(
        { listingKey: listing.ListingKey },
        {
          listingKey: listing.ListingKey,
          listPrice: listing.ListPrice,
          listAgentKey: listing.ListAgentKey,
          status: listing.StandardStatus,
          modificationTimestamp: new Date(listing.ModificationTimestamp),
          listDate: new Date(listing.ListDate),
          streetNumber: listing.StreetNumberNumeric,
          streetName: listing.StreetName,
          city: listing.City,
          state: listing.StateOrProvince,
          zipCode: listing.PostalCode,
          bathrooms: listing.Bathrooms,
          bedrooms: listing.Bedrooms,
          livingArea: listing.LivingArea,
          yearBuilt: listing.YearBuilt,
          propertyType: listing.PropertyType,
          propertySubType: listing.PropertySubType,
          pendingTimestamp: listing.PendingTimestamp ? new Date(listing.PendingTimestamp) : null,
          closeDate: listing.CloseDate ? new Date(listing.CloseDate) : null,
          taxAnnualAmount: listing.TaxAnnualAmount,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      )

      if (result) {
        result.createdAt?.getTime() === result.updatedAt?.getTime() ? created++ : updated++
      }

      // Log progress every 100 listings
      if ((created + updated) % 100 === 0) {
        console.log(`Processed ${created + updated} listings...`)
      }
    } catch (error) {
      console.error(`Failed to import listing ${listing.ListingKey}:`, error)
    }
  }

  return { created, updated }
}

async function main() {
  try {
    console.log('Starting MLS data import...')
    const startTime = Date.now()

    // Connect to MongoDB
    await connectDB()
    console.log('Connected to MongoDB')

    // Get MLS token
    const token = await getMLSToken()
    console.log('Got MLS token')

    // Fetch all data
    const [listings, agents] = await Promise.all([
      fetchAllListings(token),
      fetchAllAgents(token)
    ])

    // Import agents first (because listings reference agents)
    const agentStats = await importAgents(agents)
    console.log('Agent import complete:', agentStats)

    // Then import listings
    const listingStats = await importListings(listings)
    console.log('Listing import complete:', listingStats)

    const duration = (Date.now() - startTime) / 1000
    console.log(`Import completed in ${duration.toFixed(2)} seconds`)
    console.log('Final stats:', {
      agents: agentStats,
      listings: listingStats
    })

  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

// Run the import
main() 