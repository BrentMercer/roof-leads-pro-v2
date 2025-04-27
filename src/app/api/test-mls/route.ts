import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { MLSListing, MLSAgent } from '@/lib/models/mls'
import type { MLSListingDocument, MLSAgentDocument } from '@/lib/types/mls'

export async function GET() {
  try {
    // Connect to the database
    await connectDB()
    
    // Count documents
    const listingCount = await MLSListing.countDocuments()
    const agentCount = await MLSAgent.countDocuments()
    
    // Get a sample of each collection
    const sampleListing = await MLSListing.findOne().lean() as MLSListingDocument | null
    const sampleAgent = await MLSAgent.findOne().lean() as MLSAgentDocument | null
    
    return NextResponse.json({
      success: true,
      counts: {
        listings: listingCount,
        agents: agentCount
      },
      samples: {
        listing: sampleListing ? { 
          id: sampleListing._id.toString(),
          type: typeof sampleListing 
        } : null,
        agent: sampleAgent ? { 
          id: sampleAgent._id.toString(),
          type: typeof sampleAgent
        } : null
      }
    })

  } catch (error) {
    console.error('MLS test failed:', error)
    return NextResponse.json(
      { 
        error: 'MLS test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 