'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import LoadingSpinner from '@/app/components/admin-dashboard/LoadingSpinner'
import Image from 'next/image'
import { SweetAlerts } from '@/lib/sweetAlert'
import ManagementModal from '@/app/components/admin-dashboard/ManagementModal'
import ConfirmModal from '@/app/components/admin-dashboard/ConfirmModal'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

export default function ManagementPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [management, setManagement] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modal management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedManagement, setSelectedManagement] = useState<any>(null)

  // Modal konfirmasi delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deleteManagementId, setDeleteManagementId] = useState<number | null>(null)

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

  // Fetch management
  const fetchManagement = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/management', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed fetch management')
      }
      const response = await res.json()
      setManagement(response.data || [])
    } catch (error) {
      SweetAlerts.error.simple(
        'Gagal Memuat Data',
        'Terjadi kesalahan saat memuat data management. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchManagement()
  }, [user])

  // Delete management
  const handleDeleteClick = async (id: number) => {
    const member = management.find(m => m.id === id)
    const memberName = member?.name || 'anggota ini'
    
    const result = await SweetAlerts.confirm.delete(memberName)
    
    if (result.isConfirmed) {
      // Show loading
      SweetAlerts.loading.show('Menghapus Data...', 'Sedang menghapus data management')
      
      try {
        const res = await fetch(`/api/management/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Delete gagal')
        }
        
        // Close loading and show success
        await SweetAlerts.custom.managementDeleted(memberName)
        fetchManagement()
        
      } catch (error) {
        SweetAlerts.error.withDetails(
          'Gagal Menghapus Data',
          'Terjadi kesalahan saat menghapus data management.',
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    }
  }

  const handleDeleteConfirm = async () => {
    // This function is no longer needed but kept for compatibility
    if (!deleteManagementId) return
    try {
      const res = await fetch(`/api/management/${deleteManagementId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Delete gagal')
      }
      SweetAlerts.toast.success('Data management berhasil dihapus')
      fetchManagement()
    } catch (error) {
      SweetAlerts.toast.error('Gagal hapus data management')
    } finally {
      setIsConfirmOpen(false)
      setDeleteManagementId(null)
    }
  }

  // Toggle status
  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    const member = management.find(m => m.id === id)
    const memberName = member?.name || 'anggota ini'
    const statusText = newStatus ? 'mengaktifkan' : 'menonaktifkan'
    
    const result = await SweetAlerts.confirm.action(
      `${newStatus ? 'Aktifkan' : 'Nonaktifkan'} Anggota?`,
      `Apakah Anda yakin ingin ${statusText} ${memberName}?`,
      `Ya, ${newStatus ? 'Aktifkan' : 'Nonaktifkan'}!`
    )
    
    if (result.isConfirmed) {
      // Show loading
      SweetAlerts.loading.show('Memperbarui Status...', `Sedang ${statusText} anggota management`)
      
      try {
        const status = newStatus ? 'active' : 'inactive'
        const formData = new FormData()
        formData.append('status', status)
        formData.append('name', member?.name || '')
        formData.append('position', member?.position || '')
        formData.append('imagePath', member?.imagePath || '')

        const res = await fetch(`/api/management/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })
        
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Gagal update status')
        }
        
        // Close loading and show success
        SweetAlerts.toast.success(
          `Status ${memberName} berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`
        )
        fetchManagement()
        
      } catch (error) {
        SweetAlerts.error.simple(
          'Gagal Memperbarui Status',
          `Terjadi kesalahan saat ${statusText} anggota management.`
        )
      }
    }
  }

  // Open modal management
  const handleOpenModal = (managementItem?: any) => {
    setSelectedManagement(managementItem || null)
    setIsModalOpen(true)
  }


  if (!user) return <LoadingSpinner />

  const activeCount = management.filter(m => m.status === 'active').length

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
            <StatsGrid/>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                  Management Team
                </h1>
                <p className="text-gray-600 mt-2">
                  Kelola tim management untuk ditampilkan di website
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">
                      {activeCount} anggota aktif
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Total {management.length} anggota
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Tambah Anggota</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : management.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum Ada Data Management
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai tambahkan anggota tim management untuk ditampilkan di website
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Tambah Anggota Pertama</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {management.map((member, index) => {
                const isActive = member.status === 'active'
                return (
                  <div key={member.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition overflow-hidden">
                    <div className="relative h-64">
                      <Image 
                        src={member.imagePath || '/default-avatar.png'} 
                        alt={member.name} 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-lg">{member.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <BriefcaseIcon className="w-4 h-4 text-white/80" />
                          <p className="text-white/80 text-sm">{member.position}</p>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
                        {isActive ? 'Aktif' : 'Nonaktif'}
                      </div>
                      <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-700">
                        {index + 1}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      {/* Toggle Status */}
                      <button
                        onClick={() => handleToggleStatus(member.id, !isActive)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm
                          ${isActive
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {isActive ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                        <span>{isActive ? 'Status Aktif' : 'Status Nonaktif'}</span>
                      </button>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(member)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <PencilIcon className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(member.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <TrashIcon className="w-4 h-4" /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          
          {/* Info Section */}
          {management.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Tips Pengelolaan Tim Management
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Gunakan foto profil berkualitas tinggi dengan latar belakang profesional</li>
                    <li>• Pastikan nama dan posisi/jabatan ditulis dengan jelas dan akurat</li>
                    <li>• Foto sebaiknya berukuran persegi (1:1) untuk tampilan yang konsisten</li>
                    <li>• Aktifkan hanya anggota yang masih aktif dalam organisasi</li>
                    <li>• Urutkan berdasarkan hierarki atau tingkat kepentingan</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal management */}
      {isModalOpen && (
        <ManagementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          management={selectedManagement}
          onSuccess={fetchManagement}
        />
      )}

      {/* Modal konfirmasi hapus */}
      {isConfirmOpen && (
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
          message="Apakah Anda yakin ingin menghapus data management ini?"
        />
      )}

    </div>
  )
}