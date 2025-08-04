'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import RoleList from './list/page'

interface AuthUser {
  email: string
  roles: string[]
}

export default function RolePage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

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
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!authUser && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Memuat...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64">
          <DashboardHeader onLogout={handleLogout} />
          <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <StatsGrid />
            <RoleList />
          </main>
        </div>
      </div>
    </div>
  )
}