'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import { SweetAlerts } from '@/lib/sweetAlert'
import NewsModal from '@/app/components/admin-dashboard/NewsModal'
import { PencilIcon, PlusIcon, TrashIcon, EyeIcon, EyeSlashIcon, NewspaperIcon } from '@heroicons/react/24/outline'

interface NewsItem {
  id: number
  title: string
  slug: string
  content: string
  imagePath?: string
  status: 'active' | 'inactive'
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export default function NewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<NewsItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<NewsItem | null>(null)

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

  const fetchNews = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/news', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Gagal memuat berita')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      SweetAlerts.error.simple('Gagal Memuat', 'Tidak dapat memuat daftar berita')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNews() }, [])

  const handleOpenCreate = () => { setSelected(null); setIsModalOpen(true) }
  const handleOpenEdit = (item: NewsItem) => { setSelected(item); setIsModalOpen(true) }
  const handleCloseModal = () => setIsModalOpen(false)
  const handleSuccess = () => fetchNews()

  const handleDelete = async (id: number) => {
    const confirm = await SweetAlerts.confirm.delete('Berita ini')
    if (!confirm.isConfirmed) return
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Gagal menghapus')
      SweetAlerts.toast.success('Berita dihapus')
      fetchNews()
    } catch {
      SweetAlerts.error.simple('Gagal Menghapus', 'Tidak dapat menghapus berita')
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
                  <NewspaperIcon className="w-8 h-8 text-blue-600" />
                  News
                </h1>
                <p className="text-gray-600 mt-2">Kelola berita yang akan ditampilkan di website</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">{activeCount} berita aktif</span>
                  </div>
                  <div className="text-sm text-gray-500">Total {items.length} berita</div>
                </div>
              </div>
              <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                <PlusIcon className="w-5 h-5" /> Tambah Berita
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-sm text-gray-600">
                    <th className="p-4">Judul</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Terbit</th>
                    <th className="p-4 w-48">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-t text-sm">
                      <td className="p-4 font-medium text-gray-900">{item.title}</td>
                      <td className="p-4 text-gray-600">{item.slug}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '-'}</td>
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
                      <td colSpan={5} className="p-6 text-center text-gray-500">Belum ada berita</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <NewsModal isOpen={isModalOpen} onClose={handleCloseModal} news={selected} onSuccess={handleSuccess} />
        </main>
      </div>
    </div>
  )
}



