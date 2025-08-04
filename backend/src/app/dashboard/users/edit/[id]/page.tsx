'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import DynamicForm, { FormConfig } from '@/app/components/admin-dashboard/DynamicForm'
import { ROLES } from '@/constants/roles'

type User = {
  id: number
  name: string
  email: string
  status: string
}

type AuthUser = {
  email: string
  roles: string[]
}

type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
}

export default function EditUserPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch authenticated user
    fetch('/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token')
            router.push('/login')
            return
          }
          throw new Error('Gagal memuat data pengguna')
        }
        const data: ApiResponse<AuthUser> = await res.json()
        if (data.success && data.data) {
          // Hanya superadmin yang boleh mengakses halaman edit
          if (!data.data.roles.includes(ROLES.SUPERADMIN)) {
            setError('Akses ditolak: Hanya superadmin yang dapat mengedit pengguna')
            router.push('/dashboard')
            return
          }
          setAuthUser(data.data)
        } else {
          throw new Error(data.message || 'Gagal memuat data pengguna')
        }
      })
      .catch((err) => {
        console.error('Error fetching auth user:', err)
        setError(err.message || 'Gagal memuat data pengguna')
        localStorage.removeItem('token')
        router.push('/login')
      })

    // Fetch user data
    if (id) fetchUser()
  }, [id, router])

  async function fetchUser() {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token tidak ditemukan')

      const res = await fetch(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        if (res.status === 403) {
          setError('Akses ditolak: Hanya superadmin yang dapat mengedit pengguna')
          router.push('/dashboard')
          return
        }
        throw new Error('Gagal memuat pengguna')
      }

      const data: ApiResponse<User> = await res.json()
      if (data.success && data.data) {
        setUser({
          id: Number(data.data.id),
          name: data.data.name,
          email: data.data.email,
          status: data.data.status,
        })
      } else {
        throw new Error(data.message || 'Gagal memuat pengguna')
      }
    } catch (err) {
      console.error('Error fetching user:', err)
      setError(err instanceof Error ? err.message : 'Gagal memuat pengguna')
    }
  }

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setError('')
    setTimeout(() => router.push('/dashboard/users'), 1500)
  }

  const handleError = (message: string) => {
    setError(message)
    setSuccess('')
  }

  const formConfig: FormConfig = {
    title: 'Edit Pengguna',
    description: 'Perbarui data pengguna di dashboard admin',
    fields: [
      {
        name: 'name',
        label: 'Nama',
        type: 'text',
        placeholder: 'Masukkan nama',
        required: true,
        value: user?.name || '',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        placeholder: 'Masukkan email',
        required: true,
        value: user?.email || '',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        placeholder: 'Pilih status',
        required: true,
        value: user?.status || '',
        fetchUrl: undefined,
        options: [
          { value: 'active', display: 'Aktif' },
          { value: 'inactive', display: 'Tidak Aktif' },
        ],
      },
    ],
    submitUrl: `/api/user/${id}`,
    submitMethod: 'PATCH', // Ubah ke PATCH sesuai API
    redirectUrl: '/dashboard/users',
  }

  if (!authUser && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Memuat...</div>
      </div>
    )
  }

  if (error && !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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