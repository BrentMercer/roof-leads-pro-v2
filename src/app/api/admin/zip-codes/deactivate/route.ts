import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { findUnique, update } from '@/lib/models/user'
import { User } from '@/types/user'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is super admin
    const currentUser = await findUnique({ email: session.user.email }) as User | null

    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { userId, zipCode } = await req.json()

    if (!userId || !zipCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the user and validate the zip code assignment
    const user = await findUnique({ id: userId }) as User | null

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const assignment = user.assignedZipCodes?.find(
      a => a.zipCode === zipCode && a.active
    )

    if (!assignment) {
      return NextResponse.json({ error: 'Active zip code assignment not found' }, { status: 404 })
    }

    // Update the zip code assignment to inactive
    const updatedUser = await update(
      { id: userId },
      {
        $set: {
          'assignedZipCodes.$[elem].active': false
        }
      },
      {
        arrayFilters: [
          { 'elem.zipCode': zipCode, 'elem.active': true }
        ]
      }
    ) as User

    return NextResponse.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      assignedZipCodes: updatedUser.assignedZipCodes
    })
  } catch (error) {
    console.error('Error deactivating zip code:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate zip code' },
      { status: 500 }
    )
  }
} 