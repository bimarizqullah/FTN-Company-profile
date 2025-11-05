import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middlewares/authMiddleware'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET semua kategori dengan filter type
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') as 'news' | 'article' | null
  const where: any = { status: 'active' }
  if (type) where.OR = [{ type }, { type: 'both' }]

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      subCategories: {
        where: {
          status: 'active',
          ...(type ? { OR: [{ type }, { type: 'both' }] } : {})
        },
        orderBy: { name: 'asc' }
      },
      _count: { select: { news: true, articles: true } }
    }
  })
  return NextResponse.json(categories)
}

// POST tambah kategori
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
        type: (formData.get('type')?.toString() || 'both') as 'news' | 'article' | 'both',
        status: (formData.get('status')?.toString() || 'active') as 'active' | 'inactive',
        createdBy: userId
      }
    }

    if (!data.name.trim() || !data.slug.trim()) {
      return NextResponse.json({ message: 'Name dan slug wajib diisi' }, { status: 400 })
    }

    // Validasi type
    if (!['news', 'article', 'both'].includes(data.type)) {
      return NextResponse.json({ message: 'Type harus news, article, atau both' }, { status: 400 })
    }

    // Cek apakah slug sudah ada
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug }
    })
    if (existing) {
      return NextResponse.json({ message: 'Slug sudah digunakan' }, { status: 400 })
    }

    const created = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type as any,
        status: data.status as any,
        createdBy: userId
      },
      include: {
        subCategories: true,
        _count: {
          select: {
            news: true,
            articles: true
          }
        }
      }
    })

    return NextResponse.json({ message: 'Kategori berhasil dibuat', data: created }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal membuat kategori', error: error.message }, { status: 500 })
  }
}


