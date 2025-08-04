import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function authMiddleware(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No token provided:', authHeader);
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === 'string') {
      console.error('Invalid token:', token);
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
      include: {
        roles: {
          include: {
            role: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
    }

    if (user.status === 'inactive') {
      console.error('Inactive user attempted access:', decoded.userId);
      return NextResponse.json({ message: 'Akun Anda tidak aktif. Hubungi administrator.' }, { status: 403 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', String(user.id));
    requestHeaders.set('x-user-roles', JSON.stringify(user.roles.map(r => r.role.role)));

    return null;
  } catch (err: any) {
    console.error('Middleware Error:', {
      message: err.message,
      stack: err.stack,
    });
    return NextResponse.json({ message: 'Unauthorized: Middleware error', error: err.message }, { status: 401 });
  }
}