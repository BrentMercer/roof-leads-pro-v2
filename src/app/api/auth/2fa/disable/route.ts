import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { findUnique, update } from '@/lib/models/user'
import { User } from '@/types/user'

export async function POST(req: Request) {
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

    if (!user?.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 }
      )
    }

    await update(
      { id: user._id },
      {
        $set: {
          twoFactorEnabled: false,
          twoFactorSecret: null
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('2FA Disable Error:', error)
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
} 