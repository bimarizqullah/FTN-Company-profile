'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import LoadingSpinner from '@/app/components/admin-dashboard/LoadingSpinner'
import {
  UserIcon,
  ShieldCheckIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

interface SettingsTab {
  id: string
  name: string
  href: string
  icon: React.ReactNode
  description: string
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

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
        const resData = await res.json()
        setUser(resData.data)
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const tabs: SettingsTab[] = [
    {
      id: 'profile',
      name: 'Profile Settings',
      href: '/dashboard/settings/profile',
      icon: <UserIcon className="w-5 h-5" />,
      description: 'Manage your profile information'
    },
    {
      id: 'security',
      name: 'Security',
      href: '/dashboard/settings/security',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      description: 'Change password and security settings'
    },
    {
      id: 'system',
      name: 'System Settings',
      href: '/dashboard/settings/system',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      description: 'Backup and system configuration'
    }
  ]

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:pl-64">
          <DashboardHeader onLogout={handleLogout} />
          
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Settings Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
              {/* Settings Navigation */}
              <div className="xl:w-80 flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const isActive = pathname === tab.href || (pathname === '/dashboard/settings' && tab.id === 'profile')
                      
                      return (
                        <Link
                          key={tab.id}
                          href={tab.href}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                            {tab.icon}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {tab.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {tab.description}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
