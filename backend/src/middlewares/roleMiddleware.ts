import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function roleMiddleware(req: NextRequest, allowedRoles: string[]) {
  try {
    const authHeader = req.headers.get('Authorization');
    const rolesHeader = req.headers.get('x-user-roles');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No token provided in roleMiddleware:', authHeader);
      return NextResponse.json({ message: 'Unauthorized - No token provided' }, { status: 401 });
    }

    let roles: string[] = [];
    if (rolesHeader) {
      roles = JSON.parse(rolesHeader);
    } else {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (!decoded || !decoded.roles) {
        console.error('Invalid token payload:', decoded);
        return NextResponse.json({ message: 'Unauthorized - Invalid token payload' }, { status: 403 });
      }
      roles = decoded.roles;
    }

    const hasPermission = roles.some((role) => allowedRoles.includes(role));
    if (!hasPermission) {
      console.error('Insufficient role:', roles, 'Required:', allowedRoles);
      return NextResponse.json({ message: 'Forbidden - Insufficient role' }, { status: 403 });
    }

    return null;
  } catch (error: any) {
    console.error('Role Middleware Error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: 'Unauthorized: Role middleware error', error: error.message }, { status: 401 });
  }
}