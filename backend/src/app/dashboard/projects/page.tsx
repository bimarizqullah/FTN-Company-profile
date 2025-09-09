'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import LoadingSpinner from '@/app/components/admin-dashboard/LoadingSpinner'
import Image from 'next/image'
import { SweetAlerts } from '@/lib/sweetAlert'
import ProjectModal from '@/app/components/admin-dashboard/ProjectModal'
import ConfirmModal from '@/app/components/admin-dashboard/ConfirmModal'
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PhotoIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

export default function ProjectsPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<any>(null)

    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null)

    // Auth
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

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/project', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!res.ok) throw new Error('Failed fetch project')
            const data = await res.json()
            setProjects(data)
        } catch {
            SweetAlerts.error.simple(
                'Gagal Memuat Data',
                'Terjadi kesalahan saat memuat data project. Silakan coba lagi.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) fetchProjects()
    }, [user])

    const handleDeleteClick = async (id: number) => {
        const project = projects.find(p => p.id === id)
        const projectName = project?.name || 'project ini'
        
        const result = await SweetAlerts.confirm.delete(projectName)
        
        if (result.isConfirmed) {
            // Show loading
            SweetAlerts.loading.show('Menghapus Project...', 'Sedang menghapus project')
            
            try {
                const res = await fetch(`/api/project/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (!res.ok) throw new Error('Delete gagal')
                
                // Show success
                SweetAlerts.toast.success(`Project "${projectName}" berhasil dihapus`)
                fetchProjects()
            } catch (error) {
                SweetAlerts.error.withDetails(
                    'Gagal Menghapus Project',
                    'Terjadi kesalahan saat menghapus project.',
                    error instanceof Error ? error.message : 'Unknown error'
                )
            }
        }
    }

    const handleDeleteConfirm = async () => {
        // This function is no longer needed but kept for compatibility
        if (!deleteProjectId) return
        try {
            const res = await fetch(`/api/project/${deleteProjectId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!res.ok) throw new Error('Delete gagal')
            SweetAlerts.toast.success('Project berhasil dihapus')
            fetchProjects()
        } catch {
            SweetAlerts.toast.error('Gagal hapus project')
        } finally {
            setIsConfirmOpen(false)
            setDeleteProjectId(null)
        }
    }

    const handleOpenModal = (project?: any) => {
        setSelectedProject(project || null)
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
                    <div className="mb-8">
                        <StatsGrid />
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <PhotoIcon className="w-8 h-8 text-blue-600" />
                                    Projects Management
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Kelola daftar proyek yang telah dibuat
                                </p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-600">
                                            {projects.length} total project
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                                <span className="font-medium">Tambah Project</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PhotoIcon className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Project
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Mulai tambahkan proyek baru untuk dokumentasi portofolio
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Tambah Project Pertama</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition overflow-hidden">
                                    <div className="relative h-52">
                                        <Image src={project.imagePath} alt={project.name} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                            <h3 className="text-white font-bold">{project.name}</h3>
                                            <p className="text-white/80 text-sm">{project.location}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(project)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
                                        >
                                            <PencilIcon className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(project.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
                                        >
                                            <TrashIcon className="w-4 h-4" /> Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tips */}
                    {projects.length > 0 && (
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Tips Menyusun Proyek
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Gunakan gambar berkualitas tinggi dan sesuai konteks</li>
                                        <li>• Masukkan deskripsi singkat tapi informatif</li>
                                        <li>• Pastikan lokasi proyek ditulis dengan benar</li>
                                        <li>• Atur urutan tampil sesuai kronologi atau prioritas</li>
                                        <li>• Gunakan status untuk mengelola visibilitas publik</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ProjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    project={selectedProject}
                    onSuccess={fetchProjects}
                />
            )}

            {/* Modal Hapus */}
            {isConfirmOpen && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    message="Apakah Anda yakin ingin menghapus project ini?"
                />
            )}
        </div>
    )
}
