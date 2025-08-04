import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { roleMiddleware } from '@/middlewares/roleMiddleware';
import { ROLES } from '@/constants/roles';

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    console.error('Auth Middleware Error:', authResponse);
    return authResponse;
  }

  const roleResponse = await roleMiddleware(req, [ROLES.SUPERADMIN]);
  if (roleResponse) {
    console.error('Role Middleware Error:', roleResponse);
    return roleResponse;
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        imagePath: true,
        name: true,
        email: true,
        status: true,
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

    const formattedUsers = users.map(user => ({
      id: user.id,
      imagePath: user.imagePath,
      name: user.name,
      email: user.email,
      status: user.status,
      roles: user.roles.map(userRole => ({
        role: {
          id: userRole.role.id,
          role: userRole.role.role,
        },
      })),
    }));

    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error: any) {
    console.error('Error mengambil pengguna:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: 'Gagal mengambil pengguna', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  const roleResponse = await roleMiddleware(req, [ROLES.SUPERADMIN]);
  if (roleResponse) return roleResponse;

  try {
    const { imagePath, name, email, password, status, roleIds } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Format email tidak valid' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Kata sandi harus minimal 6 karakter' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        imagePath,
        name,
        email,
        password: hashedPassword,
        status,
        roles: roleIds
          ? {
              create: roleIds.map((roleId: number) => ({
                roleId,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        imagePath: true,
        name: true,
        email: true,
        status: true,
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

    const formattedUser = {
      id: user.id,
      imagePath: user.imagePath,
      name: user.name,
      email: user.email,
      status: user.status,
      roles: user.roles.map(userRole => ({
        role: {
          id: userRole.role.id,
          role: userRole.role.role,
        },
      })),
    };

    return NextResponse.json({ message: 'Pengguna berhasil dibuat', user: formattedUser }, { status: 201 });
  } catch (error: any) {
    console.error('Error membuat pengguna:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: 'Gagal membuat pengguna', error: error.message }, { status: 500 });
  }
}