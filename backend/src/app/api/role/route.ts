// GET all roles, POST create role
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const roles = await prisma.role.findMany({
    include: { permissions: true }
  })
  return NextResponse.json(roles)
}

export async function POST(req: Request) {
  const data = await req.json()
  const { role, description } = data

  const newRole = await prisma.role.create({
    data: { role, description }
  })

  return NextResponse.json(newRole)
}
