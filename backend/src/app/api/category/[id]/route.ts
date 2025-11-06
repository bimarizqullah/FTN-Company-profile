import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middlewares/authMiddleware'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET detail kategori by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: {
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            news: true,
            articles: true
          }
        }
      }
    })
    if (!category) return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 })
    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil kategori', error: error.message }, { status: 500 })
  }
}

// PUT update kategori
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 })

    const contentType = req.headers.get('content-type') || ''
    let updateData: any = {}

    if (contentType.includes('application/json')) {
      const body = await req.json()
      updateData = {
        name: body.name ?? existing.name,
        slug: body.slug ?? existing.slug,
        description: body.description !== undefined ? body.description : existing.description,
        type: body.type ?? existing.type,
        status: body.status ?? existing.status
      }
    } else {
      const formData = await req.formData()
      updateData = {
        name: formData.get('name')?.toString() ?? existing.name,
        slug: formData.get('slug')?.toString() ?? existing.slug,
        description: formData.get('description')?.toString() ?? existing.description,
        type: formData.get('type')?.toString() ?? existing.type,
        status: (formData.get('status')?.toString() ?? existing.status) as 'active' | 'inactive'
      }
    }

    // Validasi type
    if (updateData.type && !['news', 'article', 'both'].includes(updateData.type)) {
      return NextResponse.json({ message: 'Type harus news, article, atau both' }, { status: 400 })
    }

    // Cek apakah slug sudah digunakan oleh kategori lain
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: updateData.slug }
      })
      if (slugExists) {
        return NextResponse.json({ message: 'Slug sudah digunakan' }, { status: 400 })
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: updateData.name,
        slug: updateData.slug,
        description: updateData.description,
        type: updateData.type as any,
        status: updateData.status as any
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

    return NextResponse.json({ message: 'Kategori berhasil diperbarui', data: updated })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal memperbarui kategori', error: error.message }, { status: 500 })
  }
}

// DELETE kategori
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authMiddleware(req)
  if (auth) return auth

  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 })

    // Cek apakah kategori masih digunakan
    const newsCount = await prisma.news.count({ where: { categoryId: id } })
    const articleCount = await prisma.article.count({ where: { categoryId: id } })
    const subCategoryCount = await prisma.subCategory.count({ where: { categoryId: id } })

    if (newsCount > 0 || articleCount > 0 || subCategoryCount > 0) {
      return NextResponse.json({
        message: 'Kategori tidak dapat dihapus karena masih digunakan',
        details: {
          news: newsCount,
          articles: articleCount,
          subCategories: subCategoryCount
        }
      }, { status: 400 })
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ message: 'Kategori berhasil dihapus' })
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal menghapus kategori', error: error.message }, { status: 500 })
  }
}


