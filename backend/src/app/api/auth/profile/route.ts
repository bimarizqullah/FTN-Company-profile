// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface JWTPayload {
  userId: number | string // Support both number and string IDs
  email: string
  iat: number
  exp: number
}

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Verify JWT token
    let decoded: JWTPayload
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    // Convert userId to number as per your schema
    const userId = typeof decoded.userId === 'number' ? decoded.userId : parseInt(decoded.userId.toString())

    // Find user in database based on your schema
    const user = await prisma.user.findUnique({
      where: {
        id: userId, // Int ID with autoincrement
      },
      select: {
        id: true,
        name: true,
        email: true,
        imagePath: true, // Your schema uses imagePath for avatar
        status: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                role: true, // Your schema uses 'role' field, not 'name'
                description: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Account is inactive' },
        { status: 403 }
      )
    }

    // Format user data according to your schema
    const userData = {
      id: user.id.toString(), // Convert to string for frontend consistency
      name: user.name,
      email: user.email,
      avatar: user.imagePath, // Map imagePath to avatar for frontend
      status: user.status,
      roles: user.roles.map(userRole => userRole.role.role), // Extract role names
    }

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// app/api/auth/logout/route.ts
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Option 1: Simple logout without token blacklist
    // Just return success - token will be removed from client
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Option 2: If you want token blacklisting, create this table in your schema first:
    /*
    model TokenBlacklist {
      id        String   @id @default(cuid())
      token     String   @unique
      expiresAt DateTime
      createdAt DateTime @default(now())
    }
    */
    
    // Then uncomment this code:
    // try {
    //   await prisma.tokenBlacklist.create({
    //     data: {
    //       token: token,
    //       expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    //     },
    //   })
    // } catch (dbError) {
    //   // Token might already be blacklisted, ignore error
    //   console.log('Token already blacklisted or DB error:', dbError)
    // }

    // return NextResponse.json({
    //   success: true,
    //   message: 'Logged out successfully',
    // })
    
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}