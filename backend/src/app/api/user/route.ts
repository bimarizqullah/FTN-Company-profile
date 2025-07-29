import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
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

    // Format data agar sesuai dengan UserPage.tsx
    const formattedUsers = users.map(user => ({
      id: user.id,
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
  } catch (error) {
    console.error('Error mengambil pengguna:', error);
    return NextResponse.json({ message: 'Gagal mengambil pengguna' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, roleId, status } = await req.json();

    // Validasi input
    if (!name || !email || !password || !roleId) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Format email tidak valid' }, { status: 400 });
    }

    // Validasi panjang kata sandi
    if (password.length < 6) {
      return NextResponse.json({ message: 'Kata sandi harus minimal 6 karakter' }, { status: 400 });
    }

    // Cek apakah email sudah digunakan
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Cek apakah roleId valid
    const roleExists = await prisma.role.findUnique({ where: { id: parseInt(roleId) } });
    if (!roleExists) {
      return NextResponse.json({ message: 'Peran tidak valid' }, { status: 400 });
    }

    // Hash kata sandi
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat pengguna baru
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status,
        roles: {
          create: {
            roleId: parseInt(roleId),
          },
        },
      },
      select: {
        id: true,
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

    // Format respons
    const formattedUser = {
      id: user.id,
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
  } catch (error) {
    console.error('Error membuat pengguna:', error);
    return NextResponse.json({ message: 'Gagal membuat pengguna' }, { status: 500 });
  }
}