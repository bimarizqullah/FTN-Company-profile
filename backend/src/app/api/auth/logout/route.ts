// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface JWTPayload {
  userId: number | string
  email: string
  iat: number
  exp: number
}

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
    
    // Verify token (optional - for logging purposes)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
      console.log(`User ${decoded.userId} logged out at ${new Date().toISOString()}`)
    } catch (error) {
      // Token might be expired/invalid, but still allow logout
      console.log('Logout with invalid/expired token')
    }
    
    // Option 1: Simple logout (recommended for most cases)
    // Just return success - token will be removed from client localStorage
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Option 2: If you want to implement token blacklisting
    // You would need to add a TokenBlacklist table to your schema:
    /*
    model TokenBlacklist {
      id        Int      @id @default(autoincrement())
      token     String   @unique
      expiresAt DateTime
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    */
    
    // Then use this code instead:
    /*
    try {
      await prisma.tokenBlacklist.create({
        data: {
          token: token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        },
      })
    } catch (dbError) {
      // Token might already be blacklisted, ignore error
      console.log('Token already blacklisted or DB error:', dbError)
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
    */
    
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}