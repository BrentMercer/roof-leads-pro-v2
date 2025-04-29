import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { findUnique, update } from '@/lib/models/user'
import { User } from '@/types/user'

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
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

    const updates = await req.json()
    const { userId } = params

    // Don't allow password updates through this endpoint
    if ('password' in updates) {
      delete updates.password
    }

    // Update user
    const user = await update({ id: userId }, updates) as User

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params

    // Instead of deleting, we'll just deactivate the user
    const user = await update({ id: userId }, {
      emailVerified: null // This effectively deactivates the user
    }) as User

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error deactivating user:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate user' },
      { status: 500 }
    )
  }
} 