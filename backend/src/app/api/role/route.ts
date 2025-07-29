// src/app/api/role/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const roles = await prisma.role.findMany()
  return NextResponse.json(roles)
}
