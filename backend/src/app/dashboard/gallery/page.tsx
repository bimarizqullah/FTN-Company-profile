'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import LoadingSpinner from '@/app/components/admin-dashboard/LoadingSpinner'
import Image from 'next/image'
import { SweetAlerts } from '@/lib/sweetAlert'
import GalleryModal from '@/app/components/admin-dashboard/GalleryModal'
import ConfirmModal from '@/app/components/admin-dashboard/ConfirmModal'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface GalleryImage {
  id: number
  imagePath: string
}

interface Gallery {
  id: number
  description: string
  imagePath: string
  status: 'active' | 'inactive'
  images?: GalleryImage[]
}

export default function GalleryPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [gallery, setGallery] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Modal gallery
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null)

  // Modal konfirmasi delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deleteGalleryId, setDeleteGalleryId] = useState<number | null>(null)

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

  // Fetch gallery
  const fetchGallery = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/gallery', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) throw new Error('Failed fetch gallery')
      const data = await res.json()
      setGallery(data)
    } catch {
      SweetAlerts.error.simple(
        'Gagal Memuat Data',
        'Terjadi kesalahan saat memuat data gallery. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchGallery()
  }, [user])

  // Bulk delete handler
  const handleBulkDelete = async () => {
    const itemsToDelete = selectedItems.length
    
    const result = await SweetAlerts.confirm.delete(
      `${itemsToDelete} foto yang dipilih`
    )
    
    if (result.isConfirmed) {
      SweetAlerts.loading.show('Menghapus Foto...', `Sedang menghapus ${itemsToDelete} foto dari gallery`)
      
      try {
        const deletePromises = selectedItems.map(id =>
          fetch(`/api/gallery/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        )
        
        await Promise.all(deletePromises)
        
        SweetAlerts.toast.success(`${itemsToDelete} foto berhasil dihapus`)
        setSelectedItems([])
        setIsSelectionMode(false)
        fetchGallery()
      } catch (error) {
        SweetAlerts.error.withDetails(
          'Gagal Menghapus Foto',
          'Terjadi kesalahan saat menghapus foto dari gallery.',
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    }
  }

  const handleDeleteConfirm = async () => {
    // This function is no longer needed but kept for compatibility
    if (!deleteGalleryId) return
    try {
      const res = await fetch(`/api/gallery/${deleteGalleryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) throw new Error('Delete gagal')
      SweetAlerts.toast.success('Gallery berhasil dihapus')
      fetchGallery()
    } catch {
      SweetAlerts.toast.error('Gagal hapus gallery')
    } finally {
      setIsConfirmOpen(false)
      setDeleteGalleryId(null)
    }
  }

  // Toggle status
  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    const galleryItem = gallery.find(g => g.id === id)
    const galleryName = galleryItem?.description || 'foto ini'
    const statusText = newStatus ? 'mengaktifkan' : 'menonaktifkan'
    
    const result = await SweetAlerts.confirm.action(
      `${newStatus ? 'Aktifkan' : 'Nonaktifkan'} Foto?`,
      `Apakah Anda yakin ingin ${statusText} "${galleryName}"?`,
      `Ya, ${newStatus ? 'Aktifkan' : 'Nonaktifkan'}!`
    )
    
    if (result.isConfirmed) {
      // Show loading
      SweetAlerts.loading.show('Memperbarui Status...', `Sedang ${statusText} foto`)
      
      try {
        const status = newStatus ? 'active' : 'inactive'
        const res = await fetch(`/api/gallery/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        })
        if (!res.ok) throw new Error('Gagal update status')
        
        // Close loading and show success toast
        SweetAlerts.toast.success(
          `Status "${galleryName}" berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`
        )
        fetchGallery()
      } catch (error) {
        SweetAlerts.error.simple(
          'Gagal Memperbarui Status',
          `Terjadi kesalahan saat ${statusText} foto.`
        )
      }
    }
  }

  // Open modal gallery
  const handleOpenModal = (gallery?: any) => {
    setSelectedGallery(gallery || null)
    setIsModalOpen(true)
  }

  if (!user) return <LoadingSpinner />

  const activeCount = gallery.filter(s => s.status === 'active').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="flex-1 flex flex-col lg:pl-64">
        <DashboardHeader onLogout={() => {
          localStorage.removeItem('token')
          router.push('/login')
        }} />
      </div>

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <PhotoIcon className="w-8 h-8 text-blue-600" />
                  Gallery Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Kelola foto untuk halaman gallery website
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">
                      {activeCount} gallery aktif
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isSelectionMode ? (
                  <>
                    <button
                      onClick={() => {
                        setIsSelectionMode(false)
                        setSelectedItems([])
                      }}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    {selectedItems.length > 0 && (
                      <button
                        onClick={() => handleBulkDelete()}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                        <span>Hapus {selectedItems.length} foto</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsSelectionMode(true)}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Pilih Foto
                    </button>
                    <button
                      onClick={() => handleOpenModal()}
                      className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                      <span className="font-medium">Tambah Foto</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : gallery.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhotoIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum Ada Foto
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai tambahkan foto untuk menampilkan konten menarik di halaman gallery
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Tambah Foto Pertama</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gallery.map((gallery, index) => {
                const isActive = gallery.status === 'active'
                const images = gallery.images || []
                const mainImage = images.length > 0 ? images[0].imagePath : gallery.imagePath
                const imageCount = images.length || 1
                
                return (
                  <div 
                    key={gallery.id} 
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition overflow-hidden ${
                      isSelectionMode ? 'cursor-pointer' : 'group'
                    }`}
                    onClick={() => {
                      if (isSelectionMode) {
                        setSelectedItems(prev => 
                          prev.includes(gallery.id) 
                            ? prev.filter(id => id !== gallery.id)
                            : [...prev, gallery.id]
                        )
                      } else {
                        setSelectedGallery(gallery)
                        setIsViewModalOpen(true)
                      }
                    }}
                  >
                    <div className="relative h-52">
                      <Image src={mainImage} alt={gallery.description} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold">{gallery.description}</h3>
                        {imageCount > 1 && (
                          <p className="text-white/80 text-sm mt-1">
                            {imageCount} foto
                          </p>
                        )}
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
                        {isActive ? 'Aktif' : 'Nonaktif'}
                      </div>
                      
                      {/* Selection checkbox */}
                      <div className={`absolute top-4 left-4 w-8 h-8 transition-transform duration-200 ${
                        isSelectionMode ? 'scale-100' : 'scale-0'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedItems.includes(gallery.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700'
                        } shadow-lg transition-colors duration-200`}>
                          {selectedItems.includes(gallery.id) ? '✓' : ''}
                        </div>
                      </div>

                      {/* Number indicator (visible when not in selection mode) */}
                      <div className={`absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 transition-transform duration-200 ${
                        isSelectionMode ? 'scale-0' : 'scale-100'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Hover effect (only visible when not in selection mode) */}
                      {!isSelectionMode && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                            <PhotoIcon className="w-5 h-5" />
                            <span>Lihat foto{imageCount > 1 ? ` (${imageCount})` : ''}</span>
                          </div>
                        </div>
                      )}

                      {/* Selection overlay */}
                      {isSelectionMode && (
                        <div className={`absolute inset-0 bg-blue-600/10 transition-opacity duration-200 ${
                          selectedItems.includes(gallery.id) ? 'opacity-100' : 'opacity-0'
                        }`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Info Section */}
          {gallery.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Tips Upload Foto
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Gunakan gambar berkualitas tinggi dengan rasio 16:9 untuk hasil terbaik</li>
                    <li>• Pastikan teks pada foto mudah dibaca dan menarik</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal gallery (for add/edit) */}
      {isModalOpen && (
        <GalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          gallery={selectedGallery}
          onSuccess={fetchGallery}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedGallery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">{selectedGallery.description}</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleOpenModal(selectedGallery)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-2 gap-4">
                {selectedGallery.images && selectedGallery.images.length > 0 ? (
                  selectedGallery.images.map((img: GalleryImage) => (
                    <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={img.imagePath}
                        alt={selectedGallery.description}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <Image
                      src={selectedGallery.imagePath}
                      alt={selectedGallery.description}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}