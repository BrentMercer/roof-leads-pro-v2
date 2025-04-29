import { NextResponse } from 'next/server'
import { mlsSyncService } from '@/lib/services/mls-sync-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    // Verify cron secret if provided
    const { searchParams } = new URL(request.url)
    const cronSecret = searchParams.get('key')
    
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Starting scheduled incremental MLS sync via cron job.')
    
    // Record sync start time
    const syncStartTime = new Date()
    
    // Perform the incremental sync using the MLS sync service
    const results = await mlsSyncService.syncAll('incremental')
    
    console.log('✅ Scheduled incremental MLS sync completed:', results)

    return NextResponse.json({
      success: true,
      lastSyncedAt: syncStartTime,
      results
    })
  } catch (error) {
    console.error('❌ Sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
} 