import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('No token provided:', authHeader);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    console.error('Invalid token:', token);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.userId) },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    console.error('User not found for ID:', payload.userId);
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      imagePath: user.imagePath,
      roles: user.roles.map((r) => r.role.role),
      status: user.status,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get('name') as string | null;
  const file = formData.get('image') as File | null;

  let imagePath = null;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(filePath, buffer);
    imagePath = `/uploads/${filename}`;
  }

  const updateData: { name?: string; imagePath?: string } = {};
  if (name) updateData.name = name;
  if (imagePath) updateData.imagePath = imagePath;

  try {
    const user = await prisma.user.update({
      where: { id: Number(payload.userId) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        imagePath: user.imagePath,
        status: user.status,
      },
      message: 'Profil berhasil diperbarui',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui profil' },
      { status: 500 },
    );
  }
}