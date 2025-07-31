'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'

type Role = {
  id: number
  role: string
  description: string
}

type UserRoleResponse = {
  id: number
  name: string
  email: string
  roles: Role[]
}

type AuthUser = {
  email: string
  roles: string[]
}

export default function EditUserRolePage() {
  const [allRoles, setAllRoles] = useState<Role[]>([])
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [user, setUser] = useState<UserRoleResponse | null>(null)
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

    fetchUser()
    fetchRoles()
  }, [])

  async function fetchUser() {
    try {
      const res = await fetch(`/api/user-role/${id}`)
      if (!res.ok) throw new Error('Gagal memuat pengguna')
      const data = await res.json()
      setUser(data)
      setSelectedRoles(data.roles.map((r: Role) => r.id))
    } catch (err) {
      setError('Gagal memuat pengguna')
    }
  }

  async function fetchRoles() {
    try {
      const res = await fetch('/api/role')
      if (!res.ok) throw new Error('Gagal memuat daftar peran')
      const data = await res.json()
      setAllRoles(data)
    } catch (err) {
      setError('Gagal memuat peran')
    }
  }

  function toggleRole(roleId: number) {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.put(`/api/user-role/${id}`, { roleIds: selectedRoles })
      setSuccess('Peran berhasil diperbarui!')
      setError('')
      setTimeout(() => router.push('/dashboard/user-role'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui peran')
      setSuccess('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!authUser || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
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
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Edit Role Pengguna</h1>
            <p className="text-slate-500 text-sm">Ubah peran yang dimiliki oleh pengguna</p>
            <button
              onClick={() => router.push('/dashboard/user-role')}
              className="m-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              kembali
            </button>
          </div>

          <div className="px-8 pb-8">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{success}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="text-left">
                <p className="text-slate-600 mb-2"><strong>Nama:</strong> {user.name}</p>
                <p className="text-slate-600 mb-4"><strong>Email:</strong> {user.email}</p>
              </div>
              <fieldset className="mb-4">
                <legend className="text-slate-700 font-medium mb-2">Pilih Peran:</legend>
                {allRoles.map((role) => (
                  <label key={role.id} className="block text-slate-600 mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                    />
                    {role.role} - <span className="text-sm text-slate-400">{role.description}</span>
                  </label>
                ))}
              </fieldset>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">© 2024 Admin Dashboard. Hak cipta dilindungi.</p>
        </div>
      </main>
    </div>
  )
}
