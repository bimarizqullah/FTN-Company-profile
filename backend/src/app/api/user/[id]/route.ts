import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { roleMiddleware } from '@/middlewares/roleMiddleware';
import { ROLES } from '@/constants/roles';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
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
  } catch (error: any) {
    console.error('Error fetching user:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: 'Gagal mengambil pengguna', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('PATCH request received for user:', params.id);
  
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    console.error('Auth failed:', authResponse);
    return authResponse;
  }

  const roleResponse = await roleMiddleware(req, [ROLES.SUPERADMIN]);
  if (roleResponse) {
    console.error('Role check failed:', roleResponse);
    return roleResponse;
  }

  try {
    // ✅ PERBAIKAN: Parse JSON body dengan error handling
    let body;
    try {
      body = await req.json();
      console.log('Request body:', body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { name, email, status, imagePath } = body;

    // ✅ PERBAIKAN: Validate required fields
    if (!name && !email && !status && !imagePath) {
      return NextResponse.json(
        { success: false, message: 'At least one field must be provided' },
        { status: 400 }
      );
    }

    // ✅ PERBAIKAN: Build update data with proper types
    const updateData: {
      name?: string;
      email?: string;
      status?: 'active' | 'inactive';
      imagePath?: string;
    } = {};

    if (name && typeof name === 'string') {
      updateData.name = name.trim();
    }

    if (email && typeof email === 'string') {
      updateData.email = email.trim().toLowerCase();
    }
    
    if (status && typeof status === 'string') {
      if (status === 'active' || status === 'inactive') {
        updateData.status = status;
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid status value. Must be "active" or "inactive"' },
          { status: 400 }
        );
      }
    }
    
    if (imagePath && typeof imagePath === 'string') {
      updateData.imagePath = imagePath;
    }

    console.log('Update data:', updateData);

    // ✅ PERBAIKAN: Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(params.id) }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // ✅ PERBAIKAN: Update user with error handling
    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    console.log('User updated successfully:', user);

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

  } catch (error: any) {
    console.error('Error updating profile:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    // ✅ PERBAIKAN: Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Email sudah digunakan' },
        { status: 400 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Gagal memperbarui profil',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  const roleResponse = await roleMiddleware(req, [ROLES.SUPERADMIN]);
  if (roleResponse) return roleResponse;

  try {
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Pengguna berhasil dihapus' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting user:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: 'Gagal menghapus pengguna', error: error.message }, { status: 500 });
  }
}