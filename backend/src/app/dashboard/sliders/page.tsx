'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import LoadingSpinner from '@/app/components/admin-dashboard/LoadingSpinner'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import SlidersModal from '@/app/components/admin-dashboard/SlidersModal'

export default function SlidersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sliders, setSliders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlider, setSelectedSlider] = useState<any>(null) // null = create, object = edit

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetch('/api/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized')
        const data = await res.json()
        setUser(data)
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
  }, [router])

  // Fetch sliders
  const fetchSliders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/sliders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) throw new Error('Failed fetch sliders')
      const data = await res.json()
      setSliders(data)
    } catch {
      toast.error('Gagal memuat sliders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchSliders()
  }, [user])

  // Delete slider
  const handleDelete = async (id: number) => {
    if (!confirm('Hapus slider ini?')) return
    try {
      const res = await fetch(`/api/sliders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) throw new Error('Delete gagal')
      toast.success('Slider dihapus')
      fetchSliders()
    } catch {
      toast.error('Gagal hapus slider')
    }
  }

  // Toggle status
  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    try {
      const status = newStatus ? 'active' : 'inactive'
      const res = await fetch(`/api/sliders/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Gagal update status')
      toast.success('Status slider diperbarui')
      fetchSliders()
    } catch {
      toast.error('Gagal update status slider')
    }
  }

  // Open modal
  const handleOpenModal = (slider?: any) => {
    setSelectedSlider(slider || null) // null untuk tambah
    setIsModalOpen(true)
  }

  if (!user) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col lg:pl-64">
        <DashboardHeader onLogout={() => {
          localStorage.removeItem('token')
          router.push('/login')
        }} />
      </div>

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 ml-0 lg:ml-64">
          {/* Header Section */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Sliders</h1>
              <p className="text-gray-600 text-sm">Kelola gambar slider untuk halaman utama</p>
            </div>
            <button
              onClick={() => handleOpenModal()} // create mode
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              + Tambah Slider
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : sliders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Belum ada slider</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sliders.map(slider => {
                const isActive = slider.status === 'active'
                const activeCount = sliders.filter(s => s.status === 'active').length

                return (
                  <div key={slider.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <div className="relative w-full h-40">
                      <Image
                        src={slider.imagePath}
                        alt="Slider"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-2">
                        <p className="font-bold">{slider.title}</p>
                        <p className="text-sm">{slider.subtitle}</p>
                        <p className="text-xs">{slider.tagline}</p>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <button
                        disabled={!isActive && activeCount >= 5}
                        onClick={() => handleToggleStatus(slider.id, !isActive)}
                        className={`px-3 py-1 rounded text-xs font-medium ${isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          } disabled:opacity-50`}
                      >
                        {isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                      <div className="flex justify-between">
                        <button
                          onClick={() => handleOpenModal(slider)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slider.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SlidersModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedSlider(null)
          }}
          slider={selectedSlider}
          onSuccess={() => {
            fetchSliders()
            setIsModalOpen(false)
            setSelectedSlider(null)
          }}
        />
      )}
    </div>
  )
}
