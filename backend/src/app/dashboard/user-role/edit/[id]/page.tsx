'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import DynamicForm, { FormConfig } from '@/app/components/admin-dashboard/DynamicForm'

type UserRoleResponse = {
  id: number
  userId: number
  roleId: number
  role: {
    id: number;
    role: string
    description: string
  }
  user: {
    id: number
    name: string
    email: string
  }
}

type AuthUser = {
  email: string
  roles: string[]
}

export default function EditUserRolePage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [userRole, setUserRole] = useState<UserRoleResponse | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Token tidak ditemukan. Silakan login ulang.')
      router.push('/login')
      return
    }

    // Fetch authenticated user
    fetch('/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) throw new Error('Token expired. Silakan login ulang.')
          throw new Error(`Gagal mengambil user: ${res.statusText}`)
        }
        const data = await res.json()
        setAuthUser(data)
      })
      .catch(err => {
        console.error(err)
        setError(err.message || 'Gagal autentikasi')
        localStorage.removeItem('token')
        router.push('/login')
      })

    if (id) fetchUserRole()
  }, [id])

  async function fetchUserRole() {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token tidak ditemukan')

      const res = await fetch(`/api/user-role/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized: Token expired')
        throw new Error(`Gagal mengambil data: ${res.statusText}`)
      }

      const data = await res.json()
      setUserRole(data)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Gagal memuat data user-role')
    }
  }

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setError('')
    setTimeout(() => router.push('/dashboard/user-role'), 1500)
  }

  const handleError = (message: string) => {
    setError(message)
    setSuccess('')
  }

  const formConfig: FormConfig = {
    title: 'Edit User Role',
    description: 'Perbarui role yang dimiliki user',
    fields: [
      {
        name: 'userId',
        label: 'User',
        type: 'select' as const,
        fetchUrl: '/api/user',
        displayField: 'name',
        valueField: 'id',
        value: userRole?.id ?? '',
        readOnly: true, // Tetap readOnly agar tidak bisa diubah
        },
      {
        name: 'roleId',
        label: 'Role',
        type: 'select' as const,
        fetchUrl: '/api/role',
        displayField: 'role',
        valueField: 'id',
        value: userRole?.roleId ?? '',
        readOnly: false,
      },
    ],
    submitUrl: `/api/user-role/${id}`,
    submitMethod: 'PUT',
    redirectUrl: '/dashboard/user-role',
  }

  if (!authUser && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
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
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kembali ke Login
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
          <DashboardHeader onLogout={() => {
            localStorage.removeItem('token')
            router.push('/login')
          }} />
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
