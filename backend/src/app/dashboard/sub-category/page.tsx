'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import { SweetAlerts } from '@/lib/sweetAlert'
import { PencilIcon, PlusIcon, TrashIcon, Squares2X2Icon, NewspaperIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface Category {
  id: number
  name: string
  slug: string
  type: 'news' | 'article' | 'both'
}

interface SubCategoryItem {
  id: number
  name: string
  slug: string
  description?: string
  categoryId: number
  status: 'active' | 'inactive'
  type: 'news' | 'article' | 'both'
  createdAt: string
  updatedAt: string
  category?: Category
  _count?: {
    news: number
    articles: number
  }
}

export default function SubCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<SubCategoryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<SubCategoryItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    status: 'active' as 'active' | 'inactive'
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetch('/api/user/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
  }, [router])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/category', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Gagal memuat kategori')
      const data = await res.json()
      setCategories(data)
    } catch (e) {
      console.error('Error fetching categories:', e)
    }
  }

  const fetchSubCategories = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/sub-category', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Gagal memuat sub-kategori')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      SweetAlerts.error.simple('Gagal Memuat', 'Tidak dapat memuat daftar sub-kategori')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchSubCategories()
  }, [])

  const handleOpenCreate = () => {
    setSelected(null)
    setFormData({ name: '', slug: '', description: '', categoryId: '', status: 'active' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: SubCategoryItem) => {
    setSelected(item)
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      categoryId: item.categoryId.toString(),
      status: item.status
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelected(null)
    setFormData({ name: '', slug: '', description: '', categoryId: '', status: 'active' })
  }

  const autoSlug = (value: string) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.categoryId) {
      SweetAlerts.warning.validation('Nama dan kategori wajib diisi')
      return
    }

    try {
      const token = localStorage.getItem('token') || ''
      const url = selected ? `/api/sub-category/${selected.id}` : '/api/sub-category'
      const method = selected ? 'PUT' : 'POST'

      const body = {
        name: formData.name,
        slug: formData.slug || autoSlug(formData.name),
        description: formData.description || undefined,
        categoryId: Number(formData.categoryId),
        status: formData.status
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        SweetAlerts.error.simple('Gagal Menyimpan', errorData.message || 'Terjadi kesalahan')
        return
      }

      SweetAlerts.toast.success(selected ? 'Sub-kategori berhasil diperbarui' : 'Sub-kategori berhasil ditambahkan')
      handleCloseModal()
      fetchSubCategories()
    } catch (error) {
      SweetAlerts.error.simple('Gagal Menyimpan', 'Terjadi kesalahan tak terduga')
    }
  }

  const handleDelete = async (id: number) => {
    const confirm = await SweetAlerts.confirm.delete('Sub-kategori ini')
    if (!confirm.isConfirmed) return
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`/api/sub-category/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        SweetAlerts.error.simple('Gagal Menghapus', errorData.message || 'Tidak dapat menghapus sub-kategori')
        return
      }
      SweetAlerts.toast.success('Sub-kategori dihapus')
      fetchSubCategories()
    } catch {
      SweetAlerts.error.simple('Gagal Menghapus', 'Tidak dapat menghapus sub-kategori')
    }
  }

  const activeCount = useMemo(() => items.filter(i => i.status === 'active').length, [items])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="flex-1 flex flex-col lg:pl-64">
        <DashboardHeader onLogout={() => { localStorage.removeItem('token'); router.push('/login') }} />
      </div>

      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="mb-8">
            <StatsGrid />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Squares2X2Icon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                    Sub-Category
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Kelola sub-kategori untuk berita dan artikel</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">{activeCount} aktif</span>
                    </div>
                    <span className="text-gray-500">• Total {items.length} sub-kategori</span>
                  </div>
                </div>
                <button
                  onClick={handleOpenCreate}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm"
                >
                  <PlusIcon className="w-5 h-5" />
                  Tambah Sub-Kategori
                </button>
              </div>

              {/* Tabel */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slug</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Digunakan</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        // Skeleton Loading
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                            <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                            <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                            <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                            <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                            <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded-full w-14"></div></td>
                            <td className="px-5 py-4"><div className="h-8 bg-gray-200 rounded-lg w-16"></div></td>
                          </tr>
                        ))
                      ) : items.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                            <Squares2X2Icon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="font-medium">Belum ada sub-kategori</p>
                            <p className="text-sm mt-1">Mulai tambahkan sub-kategori pertama Anda</p>
                          </td>
                        </tr>
                      ) : (
                        items.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4 font-medium text-gray-900">{item.name}</td>
                            <td className="px-5 py-4 text-sm text-gray-600 font-mono">{item.slug}</td>
                            <td className="px-5 py-4 text-sm text-gray-700">{item.category?.name || '-'}</td>
                            <td className="px-5 py-4 text-sm">
                              <div className="flex items-center gap-3 text-gray-600">
                                {item._count?.news ? (
                                  <span className="flex items-center gap-1">
                                    <NewspaperIcon className="w-4 h-4 text-orange-600" />
                                    {item._count.news}
                                  </span>
                                ) : null}
                                {item._count?.articles ? (
                                  <span className="flex items-center gap-1">
                                    <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                                    {item._count.articles}
                                  </span>
                                ) : null}
                                {!item._count?.news && !item._count?.articles && <span className="text-gray-400">—</span>}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.type === 'news' ? 'bg-orange-100 text-orange-700' :
                                item.type === 'article' ? 'bg-purple-100 text-purple-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {item.type === 'news' ? 'Berita' :
                                 item.type === 'article' ? 'Artikel' :
                                 'Semua'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEdit(item)}
                                  className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                  title="Edit"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                  title="Hapus"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-xl font-bold text-gray-900">{selected ? 'Edit Sub-Kategori' : 'Tambah Sub-Kategori'}</h2>
                  <button onClick={handleCloseModal} className="p-2 rounded-xl hover:bg-white/80 transition-colors">
                    <TrashIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                      required
                    >
                      <option value="">Pilih Kategori - Tipe</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} - {cat.type === 'news' ? 'Berita' : cat.type === 'article' ? 'Artikel' : 'Semua'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama <span className="text-red-500">*</span></label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Hardware"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                    <input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Otomatis dari nama jika dikosongi"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Deskripsi sub-kategori (opsional)"
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['active', 'inactive'] as const).map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFormData({ ...formData, status })}
                          className={`px-4 py-3 rounded-xl font-medium transition-all ${
                            formData.status === status
                              ? status === 'active'
                                ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                                : 'bg-gray-700 text-white ring-2 ring-gray-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                      Batal
                    </button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm">
                      {selected ? 'Perbarui' : 'Tambah'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}