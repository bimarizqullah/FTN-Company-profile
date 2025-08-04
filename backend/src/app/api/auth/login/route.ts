import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '@/lib/bcrypt';
import { signToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
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
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 'inactive') {
      return NextResponse.json({ message: 'Akun Anda tidak aktif. Hubungi administrator.' }, { status: 403 });
    }

    if (!comparePassword(password, user.password)) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const roles = user.roles.map((r) => r.role.role);
    const token = signToken(user.id, roles);

    return NextResponse.json({
      success: true,
      token,
      data: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        roles,
        imagePath: user.imagePath,
        status: user.status,
      },
    });
  } catch (error: any) {
    console.error('Error during login:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: 'Gagal login', error: error.message }, { status: 500 });
  }
}