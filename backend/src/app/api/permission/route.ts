// GET all roles, POST create role
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const permissions = await prisma.permission.findMany({
    include: { roles: true }
  })
  return NextResponse.json(permissions)
}

export async function POST(req: Request) {
  const data = await req.json()
  const { permission, description } = data

  const newPermisson = await prisma.permission.create({
    data: { permission, description }
  })

  return NextResponse.json(newPermisson)
}
