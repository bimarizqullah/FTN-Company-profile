import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await params untuk mengatasi error
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'ID pengguna tidak valid' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return NextResponse.json({ message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

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

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error) {
    console.error('Error mengambil pengguna:', error);
    return NextResponse.json({ message: 'Gagal mengambil pengguna' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'ID pengguna tidak valid' }, { status: 400 });
    }

    const { name, email, password, roleId, status } = await req.json();
    console.log('Received payload:', { name, email, password, roleId, status }); // Tambahkan log

    // Validasi input
    if (!name || !email || !status) {
      return NextResponse.json({ message: 'Nama, email, dan status wajib diisi' }, { status: 400 });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Format email tidak valid' }, { status: 400 });
    }

    // Cek apakah email sudah digunakan oleh pengguna lain
    const existingUser = await prisma.user.findFirst({
      where: { email, id: { not: userId } },
    });
    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Validasi status
    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 });
    }

    // Siapkan data pembaruan
    const updateData: any = {
      name,
      email,
      status,
    };

    // Jika kata sandi diisi, hash dan perbarui
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ message: 'Kata sandi harus minimal 6 karakter' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Jika roleId ada dan valid, perbarui peran
    if (roleId !== undefined && roleId !== null && roleId !== '') {
      const roleIdInt = parseInt(roleId);
      if (isNaN(roleIdInt)) {
        return NextResponse.json({ message: 'Peran tidak valid' }, { status: 400 });
      }
      const roleExists = await prisma.role.findUnique({ where: { id: roleIdInt } });
      if (!roleExists) {
        return NextResponse.json({ message: 'Peran tidak valid' }, { status: 400 });
      }
      updateData.roles = {
        deleteMany: {},
        create: {
          roleId: roleIdInt,
        },
      };
    }

    // Perbarui pengguna
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    return NextResponse.json({ message: 'Pengguna berhasil diperbarui', user: formattedUser }, { status: 200 });
  } catch (error) {
    console.error('Error memperbarui pengguna:', error);
    return NextResponse.json({ message: 'Gagal memperbarui pengguna' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await params untuk mengatasi error
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'ID pengguna tidak valid' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Hapus data terkait di tabel UserRole
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    // Hapus data terkait di tabel lain
    await prisma.slider.deleteMany({
      where: { createdBy: userId },
    });
    await prisma.gallery.deleteMany({
      where: { createdBy: userId },
    });
    await prisma.service.deleteMany({
      where: { createdBy: userId },
    });
    await prisma.project.deleteMany({
      where: { createdBy: userId },
    });
    await prisma.management.deleteMany({
      where: { createdBy: userId },
    });
    await prisma.language.deleteMany({
      where: { createdBy: userId },
    });

    // Hapus pengguna
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'Pengguna berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error('Error menghapus pengguna:', error);
    return NextResponse.json({ message: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}