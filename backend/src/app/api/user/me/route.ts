// src/app/api/user/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")
  console.log("Authorization Header:", authHeader) // Tambahkan ini

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Bearer token provided.")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]
  console.log("Extracted Token:", token) // Tambahkan ini

  const payload = verifyToken(token)
  console.log("Decoded Payload:", payload) // Tambahkan ini

  if (!payload) {
    console.log("Invalid token.")
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.userId) },
    select: { id: true, name: true, email: true },
  })

  if (!user) {
    console.log("User not found.")
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  console.log("Authenticated User:", user)
  return NextResponse.json(user)
}
