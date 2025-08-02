'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import LoadingSpinner from '@/app/components/admin-dashboard/LoadingSpinner'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import ServicesModal from '@/app/components/admin-dashboard/ServicesModal'
import ConfirmModal from '@/app/components/admin-dashboard/ConfirmModal'
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PhotoIcon,
    EyeIcon,
    EyeSlashIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

export default function ServicesPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Modal layanan
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<any>(null)

    // Modal konfirmasi delete
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [deleteServicesId, setDeleteServicesId] = useState<number | null>(null)

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

    // Fetch layanan
    const fetchServices = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/services', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!res.ok) throw new Error('Failed fetch layanan')
            const data = await res.json()
            setServices(data)
        } catch {
            toast.error('Gagal memuat layanan')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) fetchServices()
    }, [user])

    // Delete slider
    const handleDeleteClick = (id: number) => {
        setDeleteServicesId(id)
        setIsConfirmOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteServicesId) return
        try {
            const res = await fetch(`/api/services/${deleteServicesId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!res.ok) throw new Error('Delete gagal')
            toast.success('Services berhasil dihapus')
            fetchServices()
        } catch {
            toast.error('Gagal hapus slider')
        } finally {
            setIsConfirmOpen(false)
            setDeleteServicesId(null)
        }
    }

    // Toggle status
    const handleToggleStatus = async (id: number, newStatus: boolean) => {
        try {
            const status = newStatus ? 'active' : 'inactive'
            const res = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            })
            if (!res.ok) throw new Error('Gagal update status')
            toast.success('Status slider diperbarui')
            fetchServices()
        } catch {
            toast.error('Gagal update status layanan')
        }
    }

    // Open modal layanan
    const handleOpenModal = (slider?: any) => {
        setSelectedService(slider || null)
        setIsModalOpen(true)
    }

    if (!user) return <LoadingSpinner />

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
                        <StatsGrid />
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <PhotoIcon className="w-8 h-8 text-blue-600" />
                                    Services Management
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Kelola layanan untuk halaman utama website
                                </p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-600">
                                            {services.filter(s => s.status === 'active').length} layanan aktif
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                                <span className="font-medium">Tambah Layanan</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : services.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PhotoIcon className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Layanan
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Mulai tambahkan layanan untuk menampilkan konten menarik di halaman utama
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Tambah Layanan Pertama</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {services.map((service, index) => {
                                return (
                                    <div key={service.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition overflow-hidden">
                                        {/* Container ini SEKARANG HANYA untuk gambar dan overlay-nya */}
                                        <div className="relative h-52">
                                            <Image src={service.imagePath} alt={service.name} fill className="object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                                <h3 className="text-white font-bold">{service.name}</h3>
                                                <p className="text-white/80 text-sm">{service.description}</p>
                                            </div>
                                        </div>

                                        {/* POSISI BENAR: Tombol ditempatkan di sini, di bawah area gambar */}
                                        {/* Tambahkan padding (misal: p-4) agar ada jarak dari tepi card */}
                                        <div className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(service)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
                                            >
                                                <PencilIcon className="w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(service.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
                                            >
                                                <TrashIcon className="w-4 h-4" /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {/* Info Section */}
                    {services.length > 0 && (
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Tips Manage Services
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Gunakan gambar yang tidak memiliki latar belakang</li>
                                        <li>• Gunakan gambar berkualitas tinggi dengan rasio 16:9 untuk hasil terbaik</li>
                                        <li>• Maksimal 5 layanan dapat aktif bersamaan</li>
                                        <li>• Layanan akan ditampilkan berurutan di halaman utama</li>
                                        <li>• Pastikan teks pada layanan mudah dibaca dan menarik</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal slider */}
            {isModalOpen && (
                <ServicesModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    service={selectedService}
                    onSuccess={fetchServices}
                />
            )}

            {/* Modal konfirmasi hapus */}
            {isConfirmOpen && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    message="Apakah Anda yakin ingin menghapus layanan ini?"
                />
            )}
        </div>
    )
}
