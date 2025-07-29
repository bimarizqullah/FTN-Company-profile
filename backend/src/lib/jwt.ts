import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}
