import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    await connectDB()
    
    // Define User Schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      role: { 
        type: String, 
        enum: ['USER', 'SUPER_ADMIN', 'SUB_ADMIN'], 
        default: 'USER' 
      }
    }, {
      timestamps: true
    })

    // Get User model
    const User = mongoose.models.User || mongoose.model("User", userSchema)

    // Find all users without a role
    const usersWithoutRole = await User.find({ role: { $exists: false } })

    // Update users without role to have default 'USER' role
    const updatePromises = usersWithoutRole.map(user => 
      User.findByIdAndUpdate(user._id, { role: 'USER' }, { new: true })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ 
      success: true,
      message: `Updated ${usersWithoutRole.length} users with default role`,
      updatedCount: usersWithoutRole.length
    })
  } catch (error) {
    console.error('Error in role migration:', error)
    return NextResponse.json({ 
      success: false,
      error: (error as Error).message 
    }, { status: 500 })
  }
} 