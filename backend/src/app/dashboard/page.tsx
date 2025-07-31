'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import WelcomeCard from '@/app/components/admin-dashboard/WelcomeCard'
import QuickActions from '@/app/components/admin-dashboard/QuickActions'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import LoadingSpinner from '@/app/components/admin-dashboard/LoadingSpinner'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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
        setUser(data)
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!user) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:pl-64">
          <DashboardHeader onLogout={handleLogout} />
          
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

              <WelcomeCard user={user} />
              <StatsGrid />
              <QuickActions />
            
          </main>
        </div>
      </div>
    </div>
  )
}