// lib/auth.ts
import jwt from 'jsonwebtoken'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

export function signToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' })
}

export interface JwtPayloadWithUserId {
  userId: number
  iat: number
  exp: number
}

export function verifyToken(token: string): JwtPayloadWithUserId | null {
  try {
    const decoded = verify(token, process.env.JWT_SECRET as string)
    if (typeof decoded === 'object' && 'userId' in decoded) {
      return decoded as JwtPayloadWithUserId
    }
    return null
  } catch {
    return null
  }
}

export function generateToken(userId: number) {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  })
}
