import { fetchMLSData } from '../mls-api'
import { Transaction } from '../models/transaction'
import { SyncLog } from '../models/sync-log'
import type { MLSTransaction } from '../types/mls'

const MLS_API_URL = process.env.MLS_API_URL || 'https://api.mlsgrid.com/v2'

export async function syncMLSData() {
  const syncLog = await SyncLog.create({
    type: 'Full',
    status: 'In Progress',
    startTime: new Date()
  })

  try {
    const data = await fetchMLSData()
    
    await Promise.all([
      processListings(data.Active, 'Active'),
      processListings(data.UnderContract, 'Under Contract'),
      processListings(data.Closed, 'Closed')
    ])

    await syncLog.updateOne({
      status: 'Success',
      endTime: new Date()
    })

    return syncLog
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await syncLog.updateOne({
      status: 'Failed',
      endTime: new Date(),
      error: errorMessage
    })
    throw new Error(errorMessage)
  }
}

async function processListings(listings: MLSTransaction[], status: string) {
  const batchSize = 100
  for (let i = 0; i < listings.length; i += batchSize) {
    const batch = listings.slice(i, i + batchSize)
    await Promise.all(batch.map(listing => processListing(listing, status)))
  }
}

async function processListing(listing: MLSTransaction, status: string) {
  try {
    await Transaction.findOneAndUpdate(
      { listingKey: listing.ListingKey },
      {
        $set: {
          listPrice: listing.ListPrice,
          listAgentKey: listing.ListAgentKey,
          status,
          lastUpdated: new Date(),
          ...(listing.Bathrooms && { bathrooms: listing.Bathrooms }),
          ...(listing.Bedrooms && { bedrooms: listing.Bedrooms }),
          ...(listing.PropertyType && { propertyType: listing.PropertyType })
        }
      },
      { upsert: true }
    )
  } catch (error) {
    console.error(`Error processing listing ${listing.ListingKey}:`, error)
    throw error instanceof Error ? error : new Error('Failed to process listing')
  }
}

export async function getNewPendingContracts(token: string) {
  const syncLog = await SyncLog.create({
    type: 'Incremental',
    status: 'In Progress',
    startTime: new Date()
  })

  try {
    console.log('Fetching active listings...')
    const activeParams = new URLSearchParams({
      '$filter': "StandardStatus eq 'Active'",
      '$select': 'ListingKey,ListPrice,ListAgentKey,StandardStatus,ModificationTimestamp,ListDate,StreetNumberNumeric,StreetName,City,StateOrProvince,PostalCode',
      '$orderby': 'ModificationTimestamp desc',
      '$count': 'true',
      'class': 'Residential'
    }).toString()

    const activeResponse = await fetch(`${MLS_API_URL}/Property?${activeParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Prefer': 'odata.maxpagesize=100'
      }
    })

    if (!activeResponse.ok) {
      const errorText = await activeResponse.text()
      console.error('Error response:', errorText)
      throw new Error(`Failed to fetch active listings: ${activeResponse.status} ${activeResponse.statusText}`)
    }

    const activeData = await activeResponse.json()
    console.log(`Found ${activeData['@odata.count']} active listings`)

    await processListings(activeData.value, 'Active')

    await syncLog.updateOne({
      status: 'Success',
      endTime: new Date(),
      recordsProcessed: activeData['@odata.count']
    })

    return {
      activeCount: activeData['@odata.count']
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await syncLog.updateOne({
      status: 'Failed',
      endTime: new Date(),
      error: errorMessage
    })
    throw new Error(errorMessage)
  }
}

export async function syncMLSDataIncremental(token: string) {
  const syncLog = await SyncLog.create({
    type: 'Incremental',
    status: 'In Progress',
    startTime: new Date()
  })
  
  try {
    const lastSync = await getLastSuccessfulSync()
    const lastSyncTime = lastSync?.endTime || new Date(0) // If no previous sync, get all records

    // Format date for OData
    const formattedDate = lastSyncTime.toISOString()
    
    // Get all listings modified since last sync
    const params = new URLSearchParams({
      '$filter': `ModificationTimestamp gt ${formattedDate}`,
      '$select': 'ListingKey,ListPrice,ListAgentKey,StandardStatus,ModificationTimestamp,ListDate,StreetNumberNumeric,StreetName,City,StateOrProvince,PostalCode',
      '$orderby': 'ModificationTimestamp desc',
      '$count': 'true',
      'class': 'Residential'
    }).toString()

    const response = await fetch(`${MLS_API_URL}/Property?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Prefer': 'odata.maxpagesize=100'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const recordsProcessed = data['@odata.count']

    await syncLog.updateOne({
      status: 'Success',
      endTime: new Date(),
      recordsProcessed
    })

    return {
      recordsProcessed
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await syncLog.updateOne({
      status: 'Failed',
      endTime: new Date(),
      error: errorMessage
    })
    throw new Error(errorMessage)
  }
}

async function getLastSuccessfulSync() {
  return SyncLog.findOne({
    status: 'Success'
  }).sort({ endTime: -1 })
} 