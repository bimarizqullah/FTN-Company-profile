import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middlewares/authMiddleware'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET semua sub-kategori dengan filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId')
    const type = searchParams.get('type') // 'news', 'article', atau null

    const where: any = {}

    if (categoryId) {
      where.categoryId = Number(categoryId)
    }

    // Filter berdasarkan type jika ada
    if (type && (type === 'news' || type === 'article')) {
      where.OR = [
        { type: type },
        { type: 'both' }
      ]
    }

    const subCategories = await prisma.subCategory.findMany({
      where,
      orderBy: [{ name: 'asc' }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true
          }
        },
        _count: {
          select: {
            news: true,
            articles: true
          }
        }
      }
    })
    return NextResponse.json(subCategories)
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Gagal mengambil data sub-kategori', error: error.message },
      { status: 500 }
    )
  }
}

// POST tambah sub-kategori
export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 })
    }
    const userId = Number((decoded as any).userId)

    const contentType = req.headers.get('content-type') || ''
    let data: any = {}

    if (contentType.includes('application/json')) {
      const body = await req.json()
      data = {
        name: body.name,
        slug: body.slug,
        description: body.description,
        categoryId: body.categoryId,
        type: body.type || 'both',
        status: body.status || 'active',
        createdBy: userId
      }
    } else {
      const formData = await req.formData()
      data = {
        name: formData.get('name')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        description: formData.get('description')?.toString() || undefined,
        categoryId: Number(formData.get('categoryId')),
        type: (formData.get('type')?.toString() || 'both') as 'news' | 'article' | 'both',
        status: (formData.get('status')?.toString() || 'active') as 'active' | 'inactive',
        createdBy: userId
      }
    }

    if (!data.name.trim() || !data.slug.trim() || !data.categoryId) {
      return NextResponse.json({ message: 'Name, slug, dan categoryId wajib diisi' }, { status: 400 })
    }

    // Validasi type
    if (!['news', 'article', 'both'].includes(data.type)) {
      return NextResponse.json({ message: 'Type harus news, article, atau both' }, { status: 400 })
    }
    

    // Cek apakah kategori ada
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })
    if (!category) {
      return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 })
    }

    // **Sesuaikan type otomatis mengikuti category**
    if (category.type === 'news' || category.type === 'article') {
      data.type = category.type
    }

    // Cek apakah slug sudah ada
    const existing = await prisma.subCategory.findUnique({
      where: { slug: data.slug }
    })
    if (existing) {
      return NextResponse.json({ message: 'Slug sudah digunakan' }, { status: 400 })
    }

    const created = await prisma.subCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        type: data.type as any,
        status: data.status as any,
        createdBy: userId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true
          }
        },
        _count: {
          select: {
            news: true,
            articles: true
          }
        }
      }
    })

    return NextResponse.json({ message: 'Sub-kategori berhasil dibuat', data: created }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal membuat sub-kategori', error: error.message }, { status: 500 })
  }
}
