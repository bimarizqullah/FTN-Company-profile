'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import LoadingSpinner from '@/app/components/admin-dashboard/LoadingSpinner'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

interface User {
  id: string
  name: string
  email: string
  roles: string[]
  imagePath?: string
  status?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  // Edit mode states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: ''
  })

  // Auth check and fetch user data
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    fetchUserProfile()
  }, [router])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch profile')
      }

      const result = await response.json()
      if (result.success && result.data) {
        setUser(result.data)
        setProfileForm({
          name: result.data.name
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Gagal memuat profil')
    } finally {
      setLoading(false)
    }
  }

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error('Nama harus diisi')
      return
    }

    try {
      setUpdating(true)
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('name', profileForm.name)

      const response = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      if (result.success) {
        setUser(prev => prev ? { ...prev, name: profileForm.name } : null)
        setIsEditingProfile(false)
        toast.success('Profil berhasil diperbarui')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Gagal memperbarui profil')
    } finally {
      setUpdating(false)
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Ukuran file maksimal 2MB')
      return
    }

    const formData = new FormData()
    formData.append('image', file)
    if (user) {
      formData.append('name', user.name) // Include current name
    }

    try {
      setUpdating(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      const result = await response.json()
      if (result.success) {
        setUser(prev => prev ? { ...prev, imagePath: result.data.imagePath } : null)
        toast.success('Avatar berhasil diperbarui')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Gagal mengunggah avatar')
    } finally {
      setUpdating(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Profil Pengguna
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Kelola informasi akun dan pengaturan keamanan Anda
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="relative inline-block mb-6">
                    {user.imagePath ? (
                      <Image
                        src={user.imagePath}
                        alt={user.name}
                        width={120}
                        height={120}
                        className="w-30 h-30 rounded-full object-cover border-4 border-gray-100"
                      />
                    ) : (
                      <div className="w-30 h-30 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                        <span className="text-white text-3xl font-bold">
                          {getInitials(user.name)}
                        </span>
                      </div>
                    )}
                    
                    <label className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                      <CameraIcon className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={updating}
                      />
                    </label>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {user.roles.map((role, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        Status: {user.status || 'active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Settings */}
              <div className="xl:col-span-2 space-y-8">
                {/* Profile Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Informasi Profil
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Perbarui informasi dasar akun Anda
                        </p>
                      </div>
                    </div>
                    
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleUpdateProfile}
                          disabled={updating}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckIcon className="w-5 h-5" />
                          <span>Simpan</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingProfile(false)
                            setProfileForm({
                              name: user.name
                            })
                          }}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                          <span>Batal</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Nama Lengkap</p>
                          <p className="font-medium text-gray-900">{user.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Status Akun</p>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Informasi Akun
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Detail tambahan tentang akun Anda
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">User ID</p>
                          <p className="font-medium text-gray-900">{user.id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Roles</p>
                          <p className="font-medium text-gray-900">{user.roles.length} role(s)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Roles & Permissions</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white border border-blue-200 text-blue-800 rounded-lg text-xs font-medium"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}