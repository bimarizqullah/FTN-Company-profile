// src/app/api/permission/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET semua permission
export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    return NextResponse.json(permissions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get permissions' }, { status: 500 })
  }
}

// POST: Buat permission baru
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { permission, description } = body

    const newPermission = await prisma.permission.create({
      data: { permission, description }
    })

    return NextResponse.json(newPermission)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create permission' }, { status: 500 })
  }
}
