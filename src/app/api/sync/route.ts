import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { MLSAgent, MLSListing, StatusChange, SyncLog } from '@/lib/models/mls'
import { getMLSToken, getNewPendingContracts } from '@/lib/mls-auth'
import type { MLSTransaction, MLSAgent as MLSAgentType, MLSListingDocument } from '@/lib/types/mls'

async function syncAgents(agents: MLSAgentType[]) {
  console.log(`Syncing ${agents.length} agents...`)
  
  for (const agent of agents) {
    await MLSAgent.findOneAndUpdate(
      { memberKey: agent.MemberKey },
      {
        $set: {
          memberKey: agent.MemberKey,
          memberFirstName: agent.MemberFirstName,
          memberLastName: agent.MemberLastName,
          memberEmail: agent.MemberEmail,
          preferredPhone: agent.PreferredPhone,
          officeName: agent.OfficeName,
        }
      },
      { upsert: true, new: true }
    )
  }
}

async function syncTransactions(transactions: MLSTransaction[]) {
  console.log(`Syncing ${transactions.length} transactions...`)
  
  for (const transaction of transactions) {
    const existing = await MLSListing.findOne({
      listingKey: transaction.ListingKey
    }).lean() as MLSListingDocument | null

    // Check for status change
    if (existing && existing.standardStatus !== transaction.StandardStatus) {
      await StatusChange.create({
        listingId: existing._id,
        oldStatus: existing.standardStatus,
        newStatus: transaction.StandardStatus,
        daysOnMarket: Math.floor((new Date().getTime() - new Date(existing.listDate).getTime()) / (1000 * 60 * 60 * 24))
      })
    }

    // Update or create transaction
    await MLSListing.findOneAndUpdate(
      { listingKey: transaction.ListingKey },
      {
        $set: {
          listPrice: transaction.ListPrice,
          standardStatus: transaction.StandardStatus,
          modificationTimestamp: new Date(transaction.ModificationTimestamp),
          listAgentKey: transaction.ListAgentKey,
          listDate: new Date(transaction.ListDate),
          streetNumberNumeric: transaction.StreetNumberNumeric,
          streetName: transaction.StreetName,
          city: transaction.City,
          stateOrProvince: transaction.StateOrProvince,
          standardFields: {
            postalCode: transaction.PostalCode
          }
        }
      },
      { upsert: true, new: true }
    )
  }
}

export async function GET() {
  try {
    await connectDB()

    // Log sync start
    const syncLog = await SyncLog.create({
      status: 'In Progress',
      type: 'Full',
      startTime: new Date()
    })

    // Get MLS token
    const token = await getMLSToken()
    
    // Fetch data
    const { listings, agents } = await getNewPendingContracts(token)
    
    // Sync data
    await syncAgents(agents)
    await syncTransactions(listings as unknown as MLSTransaction[])

    // Update sync log
    await SyncLog.findByIdAndUpdate(syncLog._id, {
      $set: {
        status: 'Success',
        endTime: new Date(),
        recordsProcessed: listings.length + agents.length
      }
    })

    return NextResponse.json({ 
      success: true,
      agentCount: agents.length,
      transactionCount: listings.length
    })
  } catch (error) {
    console.error('Sync Error:', error)
    return NextResponse.json(
      { error: 'Failed to sync MLS data' },
      { status: 500 }
    )
  }
} 