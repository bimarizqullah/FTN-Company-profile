import { NextRequest, NextResponse } from 'next/server'
import { comparePassword } from '@/lib/bcrypt'
import { signToken, verifyToken } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      }
    }
  })

  if (!user || !comparePassword(password, user.password)) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  const token = signToken(user.id) // <- pastikan user.id adalah number

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map(r => r.role.role),
    }
  })
}
