import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { findUnique, findFirst, update } from '@/lib/models/user'
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

    const { userId, zipCode, source = 'ADMIN_ASSIGN' } = await req.json()

    if (!userId || !zipCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate zip code format
    if (!/^\d{5}$/.test(zipCode)) {
      return NextResponse.json({ error: 'Invalid zip code format' }, { status: 400 })
    }

    // Check if zip code is already assigned and active
    const existingAssignment = await findFirst({
      'assignedZipCodes': {
        $elemMatch: {
          zipCode: zipCode,
          active: true
        }
      }
    }) as User | null

    if (existingAssignment) {
      return NextResponse.json({ error: 'Zip code is already assigned to another user' }, { status: 400 })
    }

    // Get the user to assign the zip code to
    const user = await findUnique({ id: userId }) as User | null

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Assign the zip code
    const updatedUser = await update({ id: userId }, {
      $push: {
        assignedZipCodes: {
          zipCode: zipCode,
          purchaseDate: new Date(),
          active: true,
          source: source
        }
      }
    }) as User

    // Transform the response
    return NextResponse.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      assignedZipCodes: updatedUser.assignedZipCodes
    })
  } catch (error) {
    console.error('Error assigning zip code:', error)
    return NextResponse.json(
      { error: 'Failed to assign zip code' },
      { status: 500 }
    )
  }
} 