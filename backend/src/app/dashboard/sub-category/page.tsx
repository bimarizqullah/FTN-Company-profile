'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import { SweetAlerts } from '@/lib/sweetAlert'
import { PencilIcon, PlusIcon, TrashIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

interface Category {
  id: number
  name: string
  slug: string
}

interface SubCategoryItem {
  id: number
  name: string
  slug: string
  description?: string
  categoryId: number
  status: 'active' | 'inactive'
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Squares2X2Icon className="w-8 h-8 text-blue-600" />
                  Sub-Category
                </h1>
                <p className="text-gray-600 mt-2">Kelola sub-kategori untuk berita dan artikel</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">{activeCount} sub-kategori aktif</span>
                  </div>
                  <div className="text-sm text-gray-500">Total {items.length} sub-kategori</div>
                </div>
              </div>
              <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                <PlusIcon className="w-5 h-5" /> Tambah Sub-Kategori
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-sm text-gray-600">
                    <th className="p-4">Nama</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Digunakan</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 w-48">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-t text-sm">
                      <td className="p-4 font-medium text-gray-900">{item.name}</td>
                      <td className="p-4 text-gray-600">{item.slug}</td>
                      <td className="p-4 text-gray-600">{item.category?.name || '-'}</td>
                      <td className="p-4 text-gray-600">
                        {(item._count?.news || 0) + (item._count?.articles || 0)} item
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenEdit(item)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">Belum ada sub-kategori</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-2xl font-bold text-gray-900">{selected ? 'Edit Sub-Kategori' : 'Tambah Sub-Kategori'}</h2>
                  <button onClick={handleCloseModal} className="p-2 rounded-xl hover:bg-white/80">
                    <TrashIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori <span className="text-red-500">*</span></label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'active' })}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${formData.status === 'active' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Aktif
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'inactive' })}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${formData.status === 'inactive' ? 'bg-gray-700 text-white ring-2 ring-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Nonaktif
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100">
                      Batal
                    </button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800">
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





