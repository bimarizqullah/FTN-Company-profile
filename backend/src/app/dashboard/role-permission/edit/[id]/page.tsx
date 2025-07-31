'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

type Permission = {
  id: number
  permission: string
  description: string
}

type RolePermissionResponse = {
  id: number
  role: string
  description: string
  permissions: Permission[]
}

type AuthUser = {
  email: string
  roles: string[]
}

export default function EditRolePermissionPage() {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [role, setRole] = useState<RolePermissionResponse | null>(null)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch('/api/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setAuthUser(data))
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })

    fetchRole()
    fetchPermissions()
  }, [])

  async function fetchRole() {
    try {
      const res = await fetch(`/api/role-permission/${id}`)
      if (!res.ok) throw new Error('Gagal memuat role')
      const data = await res.json()
      setRole(data)
      setSelectedPermissions(data.permissions.map((p: Permission) => p.id))
    } catch (err) {
      setError('Gagal memuat role')
    }
  }

  async function fetchPermissions() {
    try {
      const res = await fetch('/api/permission')
      if (!res.ok) throw new Error('Gagal memuat daftar permission')
      const data = await res.json()
      setAllPermissions(data)
    } catch (err) {
      setError('Gagal memuat permissions')
    }
  }

  function togglePermission(permissionId: number) {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.put(`/api/role-permission/${id}`, { permissionIds: selectedPermissions })
      setSuccess('Permission berhasil diperbarui!')
      setError('')
      setTimeout(() => router.push('/dashboard/role-permission'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui permission')
      setSuccess('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!authUser || !role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={handleLogout} />
      <Sidebar />
      <main className="max-w-4xl mx-auto px-6 py-8 ml-0 md:ml-64">
        <StatsGrid />
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Edit Role Permission</h1>
                  <p className="text-sm text-gray-500">Ubah permission yang dimiliki oleh role</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/role-permission')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="px-6 py-3 bg-cyan-50 border-b border-cyan-200">
              <p className="text-sm text-cyan-600">{success}</p>
            </div>
          )}

          {/* Role Info */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-900">{role.role}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <p className="text-sm text-gray-600">{role.description || '-'}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pilih Permission
                </label>
                <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {allPermissions.map((permission) => (
                    <label key={permission.id} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 mr-2">
                            {permission.permission}
                          </span>
                        </div>
                        {permission.description && (
                          <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400">© 2024 Admin Dashboard. Hak cipta dilindungi.</p>
        </div>
      </main>
    </div>
  )
}