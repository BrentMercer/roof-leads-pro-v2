import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/user"
import type { UserDocument } from "@/lib/types/user"

export async function GET() {
  try {
    await connectDB()
    
    const user = await User.findOne({ 
      email: 'test@example.com' 
    })
    .select('email name password twoFactorEnabled twoFactorSecret')
    .lean() as UserDocument | null
    
    if (!user) {
      return NextResponse.json({ 
        success: true,
        user: null
      })
    }

    // Destructure password out and create safe user object
    const { password, ...safeUser } = user
    
    return NextResponse.json({ 
      success: true,
      user: {
        ...safeUser,
        hasPassword: !!password // Send boolean instead of actual password
      }
    })
  } catch (error) {
    console.error("Error fetching test user:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch test user",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
} 