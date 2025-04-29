import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { VerificationLog } from '@/lib/models/verification-log'
import { adminMiddleware } from '@/middleware/admin'
import type { NextRequest } from 'next/server'

const ITEMS_PER_PAGE = 10

export async function GET(req: NextRequest) {
  try {
    // Check admin access
    const middlewareResponse = await adminMiddleware(req)
    if (middlewareResponse.status !== 200) {
      return middlewareResponse
    }

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const search = url.searchParams.get('search') || ''
    const type = url.searchParams.get('type') || undefined
    const status = url.searchParams.get('status') || undefined

    // Build MongoDB query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { 'userId.email': { $regex: search, $options: 'i' } },
        { 'userId.name': { $regex: search, $options: 'i' } }
      ]
    }
    
    if (type) {
      query.type = type
    }
    
    if (status) {
      query.status = status
    }

    const [logs, total] = await Promise.all([
      VerificationLog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .populate('userId', 'email name')
        .lean(),
      VerificationLog.countDocuments(query)
    ])

    return NextResponse.json({
      logs,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE)
    })
  } catch (error) {
    console.error('Failed to fetch verification logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
} 