'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

interface Role {
  id: number
  role: string
}

interface User {
  id: number
  name: string
  email: string
}

interface UserRole {
  userId: number
  roleId: number
  user: User
  role: Role
}

interface AuthUser {
  email: string
  roles: string[]
}

export default function UserRolePage() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [error, setError] = useState('')
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
        Authorization: `Bearer ${token}`
      }
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

    fetchUserRoles()
  }, [])

  async function fetchUserRoles() {
    try {
      const res = await fetch('/api/user-role')
      if (!res.ok) throw new Error('Gagal memuat user-role')
      const data = await res.json()
      setUserRoles(data.data)
    } catch (err) {
      setError('Gagal memuat user-role')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Yakin ingin menghapus pengguna ini?')) {
      try {
        await axios.delete(`/api/user-role/${id}`)
        setError('')
        fetchUserRoles()
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal menghapus pengguna')
      }
    }
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Memuat...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DashboardHeader onLogout={() => {
        localStorage.removeItem('token')
        router.push('/login')
      }} />
      <Sidebar />
      <main className="max-w-7xl mx-auto px-6 py-8 ml-0 md:ml-64">
        <StatsGrid />
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
          <div className="px-8 pt-8 pb-6 flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-slate-800 mb-2">Manajemen User Role</h1>
              <p className="text-slate-500 text-sm">Daftar hubungan pengguna dan peran</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="m-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              kembali
            </button>
            <button
              onClick={() => router.push('/dashboard/user-role/create')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Tambah Peran Pengguna
            </button>
          </div>

          {error && (
            <div className="px-8 pb-4">
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="px-8 pb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 font-semibold rounded-tl-lg">Nama Pengguna</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Peran</th>
                    <th className="p-3 font-semibold rounded-tr-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {userRoles.map((ur, idx) => (
                    <tr key={`${ur.userId}-${ur.roleId}`} className="text-black border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-3">{ur.user.name}</td>
                      <td className="p-3">{ur.user.email}</td>
                      <td className="p-3">{ur.role.role}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/user-role/edit/${ur.userId}`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ur.userId)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          Hapus
                        </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">© 2024 Admin Dashboard. Hak cipta dilindungi.</p>
        </div>
      </main>
    </div>
  )
}