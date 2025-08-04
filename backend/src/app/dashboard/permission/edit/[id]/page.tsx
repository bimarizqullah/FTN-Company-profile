'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import DynamicForm, { FormConfig, FormField } from '@/app/components/admin-dashboard/DynamicForm'

type PermissionResponse = {
  id: number
  permission: string
  description: string
  roles: { 
    id: number; 
    role: string;
    description: string
  }[]
}

type AuthUser = {
  email: string
  roles: string[]
}

export default function PermissionPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [permission, setPermission] = useState<PermissionResponse | null>(null)
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
      fetchPermissions()
    }
  }, [id])

  async function fetchPermissions() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const res = await fetch(`/api/permission/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token')
        }
        throw new Error(`Failed to fetch permission: ${res.statusText}`)
      }
      const data = await res.json()
      setPermission(data)
    } catch (err) {
      console.error('Error fetching permission:', err)
      setError(err instanceof Error ? err.message : 'Gagal memuat permission')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setError('')
    setTimeout(() => router.push('/dashboard/permission'), 1500)
  }

  const handleError = (message: string) => {
    setError(message)
    setSuccess('')
  }

  const formConfig: FormConfig = {
    title: 'Edit Permission',
    description: 'Ubah Permission',
    fields: [
      {
        name: 'permission',
        label: 'Permission',
        type: 'text' as const,
        placeholder: 'Masukkan Permission',
        required: true,
        value: permission ? permission.permission : '',
        readOnly: false,
      },
      {
        name: 'description',
        label: 'Deskripsi',
        type: 'text' as const,
        placeholder: 'Masukkan deskripsi permission',
        required: false,
        value: permission ? permission.description || '' : '',
        readOnly: false,
      },
    ],
    submitUrl: `/api/permission/${id}`,
    submitMethod: 'PUT',
    redirectUrl: '/dashboard/permission',
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
          <main className="text-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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