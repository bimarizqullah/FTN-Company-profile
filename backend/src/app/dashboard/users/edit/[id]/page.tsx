'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import { Stats } from 'fs'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

type Role = {
  id: number
  role: string
}

type User = {
  id: number
  name: string
  email: string
  roles: { role: Role }[]
  status: string
}

type AuthUser = {
  email: string
  roles: string[]
}

export default function EditUserPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '', status: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const router = useRouter()
  const { id } = useParams()

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

    fetchRoles()
    fetchUser()
  }, [])

  async function fetchRoles() {
    try {
      const res = await fetch('/api/role')
      if (!res.ok) throw new Error('Gagal memuat peran')
      const data = await res.json()
      setRoles(data)
    } catch (err) {
      setError('Gagal memuat peran')
    }
  }

  async function fetchUser() {
    try {
      const res = await fetch(`/api/user/${id}`)
      if (!res.ok) throw new Error('Gagal memuat pengguna')
      const user: User = await res.json()
      setForm({
        name: user.name,
        email: user.email,
        password: '',
        roleId: user.roles[0]?.role.id.toString() || '',
        status: user.status
      })
    } catch (err) {
      setError('Gagal memuat pengguna')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const response = await axios.put(`/api/user/${id}`, form)
      setError('')
      setSuccess('Pengguna berhasil diperbarui!')
      setTimeout(() => {
        router.push('/dashboard/users')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui pengguna')
      setSuccess('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
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
      <DashboardHeader onLogout={handleLogout} />
      <Sidebar />
      <main className="max-w-7xl mx-auto px-6 py-8 ml-0 md:ml-64">
        <StatsGrid />
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Edit Pengguna</h1>
            <p className="text-slate-500 text-sm">Perbarui data pengguna di dashboard admin</p>
            <button
              onClick={() => router.push('/dashboard/users')}
              className="m-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              kembali
            </button>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-black px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="text-black px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                required
              />
              <select
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                className="text-black px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                required
              >
                <option value="">Pilih Peran</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.role}</option>
                ))}
              </select>
              <select 
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="text-black px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                required
              >
                <option value="">Pilih Status</option> 
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
              <button
                type="submit"
                className="col-span-1 sm:col-span-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            © 2024 Admin Dashboard. Hak cipta dilindungi.
          </p>
        </div>
      </main>
    </div>
  )
}