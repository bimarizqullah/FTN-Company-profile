// dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '../components/DashboardHeader'
import WelcomeCard from '../components/WelcomeCard'
import StatsGrid from '../components/StatsGrid'
import QuickActions from '../components/QuickActions'
import LoadingSpinner from '../components/LoadingSpinner'
import Sidebar from '../components/Sidebar'

interface User {
  email: string
  roles: string[]
}

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

  if (!user) return <div>Loading...</div>



  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!user) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DashboardHeader onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeCard user={user} />
        <Sidebar />
        <StatsGrid />
        <QuickActions />
      </main>
    </div>
  )
}