import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { MLSListing } from '@/lib/models/mls'
import { ZipCodeMetrics } from '@/lib/models/metrics'

async function calculateZipMetrics(zipCode: string) {
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Get all transactions for this ZIP code
  const transactions = await MLSListing.find({
    'standardFields.postalCode': zipCode,
    modificationTimestamp: {
      $gte: thirtyDaysAgo
    }
  }).lean()

  // Calculate recent pendings (last 24h)
  const recentPendings = transactions.filter(t => 
    t.standardStatus === 'Under Contract' && 
    new Date(t.modificationTimestamp) >= twentyFourHoursAgo
  ).length

  // Calculate total current pendings
  const totalPendings = transactions.filter(t => 
    t.standardStatus === 'Under Contract'
  ).length

  // Calculate monthly metrics
  const monthlyTransactions = transactions.length

  // Calculate average price
  const averagePrice = transactions.length > 0
    ? transactions.reduce((sum, t) => sum + (t.listPrice || 0), 0) / transactions.length
    : 0

  return {
    zipCode,
    monthlyTransactions,
    averagePrice,
    recentPendings,
    totalPendings,
    lastUpdate: now
  }
}

export async function GET() {
  try {
    await connectDB()

    // Get unique ZIP codes from transactions
    const uniqueZips = await MLSListing.distinct('standardFields.postalCode')

    const metrics = []
    for (const postalCode of uniqueZips) {
      if (!postalCode) continue // Skip if postal code is null/undefined
      
      // Calculate metrics for each ZIP code
      const zipMetrics = await calculateZipMetrics(postalCode)
      
      // Update or create metrics in database
      await ZipCodeMetrics.findOneAndUpdate(
        { zipCode: postalCode },
        {
          $set: {
            monthlyTransactions: zipMetrics.monthlyTransactions,
            averagePrice: zipMetrics.averagePrice,
            lastUpdate: zipMetrics.lastUpdate,
            recentPendings: zipMetrics.recentPendings,
            totalPendings: zipMetrics.totalPendings,
            isActive: zipMetrics.monthlyTransactions > 0
          }
        },
        { 
          upsert: true,
          new: true 
        }
      )

      metrics.push(zipMetrics)
    }

    return NextResponse.json({ 
      success: true,
      metrics,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Failed to calculate ZIP metrics:', error)
    return NextResponse.json(
      { error: 'Failed to calculate ZIP metrics' },
      { status: 500 }
    )
  }
} 