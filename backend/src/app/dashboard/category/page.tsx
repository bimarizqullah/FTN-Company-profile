'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import { SweetAlerts } from '@/lib/sweetAlert'
import { PencilIcon, PlusIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline'

interface CategoryItem {
  id: number
  name: string
  slug: string
  type: 'news' | 'article' | 'both'
  description?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  _count?: {
    news: number
    articles: number
  }
  subCategories?: Array<{
    id: number
    name: string
    slug: string
  }>
}

export default function CategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<CategoryItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<CategoryItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'both' as 'news' | 'article' | 'both',
    description: '',
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
      setLoading(true)
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/category', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Gagal memuat kategori')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      SweetAlerts.error.simple('Gagal Memuat', 'Tidak dapat memuat daftar kategori')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleOpenCreate = () => {
    setSelected(null)
    setFormData({ name: '', slug: '', type: 'both', description: '', status: 'active' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: CategoryItem) => {
    setSelected(item)
    setFormData({
      name: item.name,
      slug: item.slug,
      type: item.type,
      description: item.description || '',
      status: item.status
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelected(null)
    setFormData({ name: '', slug: '', type: 'both', description: '', status: 'active' })
  }

  const autoSlug = (value: string) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      SweetAlerts.warning.validation('Nama kategori wajib diisi')
      return
    }

    try {
      const token = localStorage.getItem('token') || ''
      const url = selected ? `/api/category/${selected.id}` : '/api/category'
      const method = selected ? 'PUT' : 'POST'

      const body = {
        name: formData.name,
        slug: formData.slug || autoSlug(formData.name),
        type: formData.type,
        description: formData.description || undefined,
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

      SweetAlerts.toast.success(selected ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan')
      handleCloseModal()
      fetchCategories()
    } catch (error) {
      SweetAlerts.error.simple('Gagal Menyimpan', 'Terjadi kesalahan tak terduga')
    }
  }

  const handleDelete = async (id: number) => {
    const confirm = await SweetAlerts.confirm.delete('Kategori ini')
    if (!confirm.isConfirmed) return
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`/api/category/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        SweetAlerts.error.simple('Gagal Menghapus', errorData.message || 'Tidak dapat menghapus kategori')
        return
      }
      SweetAlerts.toast.success('Kategori dihapus')
      fetchCategories()
    } catch {
      SweetAlerts.error.simple('Gagal Menghapus', 'Tidak dapat menghapus kategori')
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
                  <TagIcon className="w-8 h-8 text-blue-600" />
                  Category
                </h1>
                <p className="text-gray-600 mt-2">Kelola kategori untuk berita dan artikel</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">{activeCount} kategori aktif</span>
                  </div>
                  <div className="text-sm text-gray-500">Total {items.length} kategori</div>
                </div>
              </div>
              <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                <PlusIcon className="w-5 h-5" /> Tambah Kategori
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
                    <th className="p-4">Sub-Kategori</th>
                    <th className="p-4">Tipe</th>
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
                      <td className="p-4 text-gray-600">
                        {item.subCategories?.length || 0} sub-kategori
                      </td>
                      <td className="p-4 text-gray-600">{item.type}</td>
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
                      <td colSpan={6} className="p-6 text-center text-gray-500">Belum ada kategori</td>
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
                  <h2 className="text-2xl font-bold text-gray-900">{selected ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
                  <button onClick={handleCloseModal} className="p-2 rounded-xl hover:bg-white/80">
                    <TrashIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama <span className="text-red-500">*</span></label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Teknologi"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'news' | 'article' | 'both' })} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black">
                      <option value="news">News</option>
                      <option value="article">Article</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Deskripsi kategori (opsional)"
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





