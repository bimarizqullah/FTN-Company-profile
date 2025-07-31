'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Permission {
  id: number
  permission: string
  description?: string
}

interface Role {
  id: number
  role: string
  description?: string
}

interface RolePermission {
  roleId: number
  permissionId: number
  role: Role
  permission: Permission
}

export default function RolePermissionList() {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchRolePermissions()
  }, [])

  async function fetchRolePermissions() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const res = await fetch('/api/role-permission', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token')
        }
        throw new Error(`Failed to fetch role-permissions: ${res.statusText}`)
      }
      const data = await res.json()
      setRolePermissions(data.data)
      setError('')
    } catch (err) {
      console.error('Error fetching role-permissions:', err)
      setError(err instanceof Error ? err.message : 'Gagal memuat role-permission')
    }
  }

  async function handleDelete(roleId: number, permissionId: number) {
    if (confirm('Yakin ingin menghapus permission dari role ini?')) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        await axios.delete(`/api/role-permission/${roleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        setError('')
        fetchRolePermissions()
      } catch (err: any) {
        console.error('Error deleting role-permission:', err)
        setError(err.response?.data?.message || 'Gagal menghapus permission')
      }
    }
  }

  return (
    <>
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Role Permission</h1>
                <p className="text-sm text-gray-500">Kelola hubungan role dan permission</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={() => router.push('/dashboard/role-permission/create')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Tambah Permission
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Deskripsi Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Permission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Deskripsi Permission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rolePermissions.map((rp) => (
                <tr key={`${rp.roleId}-${rp.permissionId}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap w-1/5">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900 truncate">{rp.role.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 w-1/5 truncate">
                    {rp.role.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 truncate">
                      {rp.permission.permission}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 w-1/5 truncate">
                    {rp.permission.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/5">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/role-permission/edit/${rp.roleId}`)}
                        className="px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rp.roleId, rp.permissionId)}
                        className="px-3 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {rolePermissions.length === 0 && !error && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Belum ada data</h3>
            <p className="text-sm text-gray-500">Mulai dengan menambahkan role permission baru</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-xs text-gray-400">© 2024 Admin Dashboard. Hak cipta dilindungi.</p>
      </div>
    </>
  )
}