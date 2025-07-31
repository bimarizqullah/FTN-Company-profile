import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function authMiddleware(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized: No token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    const decoded = verifyToken(token);
    console.log('Decoded Token:', decoded);

    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log('Authenticated User:', user);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', String(user.id));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.error('Middleware Error:', err);
    return NextResponse.json({ message: 'Unauthorized: Middleware error' }, { status: 401 });
  }
}
