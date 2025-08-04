import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'FTN@Fiber2730';

export interface JwtPayloadWithUserId {
  userId: number;
  roles: string[];
  iat: number;
  exp: number;
}

export function signToken(userId: number, roles: string[]) {
  return jwt.sign({ userId, roles }, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): JwtPayloadWithUserId | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;
    if (decoded && 'userId' in decoded) {
      return decoded;
    }
    console.error('Token verification failed: Invalid payload');
    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}