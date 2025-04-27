import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { findUnique } from '@/lib/models/user'
import { User } from '@/types/user'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await findUnique({ 
      email: session.user.email 
    }) as User | null

    return NextResponse.json({
      enabled: Boolean(user?.twoFactorEnabled)
    })
  } catch (error) {
    console.error('2FA Status Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch 2FA status' },
      { status: 500 }
    )
  }
} 