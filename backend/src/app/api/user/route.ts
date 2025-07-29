import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  })

  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const { name, email, password, roleId } = await req.json()

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roles: {
        create: [
          {
            roleId, // asumsi kamu punya relasi user-role many-to-many
          },
        ],
      },
    },
  })

  return NextResponse.json(user)
}
