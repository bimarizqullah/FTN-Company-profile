'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

type Role = {
  id: number
  role: string
}

type Permission = {
  id: number
  name: string
}

type AuthUser = {
  email: string
  roles: string[]
}

export default function CreateRolePermissionPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [form, setForm] = useState({ roleId: '', permissionId: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch('/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized')
        const data = await res.json()
        setAuthUser(data)
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })

    fetchRoles()
    fetchPermissions()
  }, [])

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/role')
      const data = await res.json()
      setRoles(data)
    } catch (err) {
      setError('Gagal memuat daftar peran')
    }
  }

  const fetchPermissions = async () => {
    try {
      const res = await fetch('/api/permission')
      const data = await res.json()
      setPermissions(data)
    } catch (err) {
      setError('Gagal memuat daftar permission')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/role-permission', {
        roleId: parseInt(form.roleId),
        permissionId: parseInt(form.permissionId),
      })
      setForm({ roleId: '', permissionId: '' })
      setError('')
      setSuccess('Permission berhasil ditambahkan ke Role!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menambahkan permission')
      setSuccess('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!authUser) {
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Tambah Role Permission</h1>
                  <p className="text-sm text-gray-500">Hubungkan permission ke role tertentu</p>
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

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Role
                  </label>
                  <select
                    value={form.roleId}
                    onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="">-- Pilih Role --</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Permission
                  </label>
                  <select
                    value={form.permissionId}
                    onChange={(e) => setForm({ ...form, permissionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="">-- Pilih Permission --</option>
                    {permissions.map(permission => (
                      <option key={permission.id} value={permission.id}>
                        {permission.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Tambah Permission
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