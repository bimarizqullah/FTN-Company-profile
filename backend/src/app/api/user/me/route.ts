// src/app/api/user/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.userId) },
    select: { id: true, name: true, email: true },
  })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}

