import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { permissionMiddleware } from '@/middlewares/permissionMiddleware'
import { PERMISSIONS } from '@/constants/permissions'

export async function POST(req: NextRequest) {
  // Check authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  // Check permissions
  const permissionResponse = await permissionMiddleware(req, [PERMISSIONS.MANAGEMENT_CREATE]);
  if (permissionResponse) return permissionResponse;

  try {
    const body = await req.json()
    const { name, position, imagePath, createdBy } = body

    if (!name || !position) {
      return NextResponse.json(
        { success: false, message: 'Nama dan posisi wajib diisi' }, 
        { status: 400 }
      );
    }

    const newManagement = await prisma.management.create({
      data: {
        name,
        position,
        imagePath,
        createdBy,
      },
    })

    return NextResponse.json({ success: true, data: newManagement })
  } catch (error) {
    console.error('Management create error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal membuat data management',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Check authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  // Check permissions
  const permissionResponse = await permissionMiddleware(req, [PERMISSIONS.MANAGEMENT_LIST]);
  if (permissionResponse) return permissionResponse;

  try {
    const management = await prisma.management.findMany({
      include: { user: true },
      orderBy: { id: 'asc' },
    })
    return NextResponse.json({ success: true, data: management })
  } catch (error) {
    console.error('Management GET error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'Gagal mengambil data management',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

