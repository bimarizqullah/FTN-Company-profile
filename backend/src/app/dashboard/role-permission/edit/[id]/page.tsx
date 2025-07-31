'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import DynamicForm, { FormConfig, FormField } from '@/app/components/admin-dashboard/DynamicForm'

type RolePermissionResponse = {
  id: number
  role: string
  description: string
  permissions: { 
    id: number; 
    permission: string;
    description: string
  }[]
}

type AuthUser = {
  email: string
  roles: string[]
}

export default function RolePermissionPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [role, setRole] = useState<RolePermissionResponse | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No authentication token found. Please log in.')
      router.push('/login')
      return
    }

    fetch('/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Invalid or expired token. Please log in again.')
          }
          throw new Error(`Failed to fetch user data: ${res.statusText}`)
        }
        const data = await res.json()
        setAuthUser(data)
      })
      .catch(err => {
        console.error('Error fetching user:', err)
        setError(err.message || 'Failed to authenticate user')
        localStorage.removeItem('token')
        router.push('/login')
      })

    if (id) {
      fetchRole()
    }
  }, [id])

  async function fetchRole() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const res = await fetch(`/api/role-permission/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token')
        }
        throw new Error(`Failed to fetch role: ${res.statusText}`)
      }
      const data = await res.json()
      setRole(data)
    } catch (err) {
      console.error('Error fetching role:', err)
      setError(err instanceof Error ? err.message : 'Gagal memuat role')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setError('')
    setTimeout(() => router.push('/dashboard/role-permission'), 1500)
  }

  const handleError = (message: string) => {
    setError(message)
    setSuccess('')
  }

  const formConfig: FormConfig = {
    title: 'Edit Role Permission',
    description: 'Ubah permission yang dimiliki oleh role',
    fields: [
      {
        name: 'role',
        label: 'Nama Role',
        type: 'text' as const,
        placeholder: 'Masukkan nama role',
        required: true,
        value: role ? role.role : '',
        readOnly: true,
      },
      {
        name: 'description',
        label: 'Deskripsi',
        type: 'text' as const,
        placeholder: 'Masukkan deskripsi role',
        required: false,
        value: role ? role.description || '' : '',
        readOnly: true,
      },
      {
        name: 'permissionIds',
        label: 'Pilih Permission',
        type: 'checkbox-list' as const,
        fetchUrl: '/api/permission',
        displayField: 'permission',
        descriptionField: 'description',
        valueField: 'id',
        value: role ? role.permissions.map((p) => p.id) : [],
        readOnly: false,
      },
    ],
    submitUrl: `/api/role-permission/${id}`,
    submitMethod: 'PUT',
    redirectUrl: '/dashboard/role-permission',
  }

  if (!authUser && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat...</div>
      </div>
    )
  }

  if (error && !authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64">
          <DashboardHeader onLogout={handleLogout} />
          <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <StatsGrid />
            <DynamicForm
              config={formConfig}
              error={error}
              success={success}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </main>
        </div>
      </div>
    </div>
  )
}