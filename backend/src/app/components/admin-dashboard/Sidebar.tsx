'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'

interface User {
  id: string
  name: string
  email: string
  roles: string[]
  imagePath?: string
  status?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  group: string // Properti baru untuk pengelompokan
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<User> = await response.json()
      
      if (result.success && result.data) {
        setUser(result.data)
      } else {
        throw new Error(result.message || 'Failed to fetch user profile')
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(console.error)
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5v4" />
        </svg>
      ),
      href: '/dashboard',
      group: 'General',
    },
    {
      id: 'users',
      label: 'Users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      href: '/dashboard/users',
      group: 'User Management',
    },
    {
      id: 'user-role',
      label: 'User Roles',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l2 2-2 2" />
        </svg>
      ),
      href: '/dashboard/user-role',
      group: 'User Management',
    },
    {
      id: 'role-permission',
      label: 'Role Permission',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      href: '/dashboard/role-permission',
      group: 'User Management',
    },
    {
      id: 'managements',
      label: 'Official Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      href: '/dashboard/management',
      group: 'Content Management',
    },
    {
      id: 'sliders',
      label: 'Sliders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8l4 4-4 4" />
        </svg>
      ),
      href: '/dashboard/sliders',
      group: 'Content Management',
    },
    {
      id: 'gallery',
      label: 'Galleries',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      href: '/dashboard/gallery',
      group: 'Content Management',
    },
    {
      id: 'services',
      label: 'Services',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13h8" />
        </svg>
      ),
      href: '/dashboard/services',
      group: 'Content Management',
    },
    {
      id: 'projects',
      label: 'Project',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8l4 4-4 4" />
        </svg>
      ),
      href: '/dashboard/projects',
      group: 'Content Management',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/settings',
      group: 'Configuration',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: '/dashboard/profile',
      group: 'General',
    }
  ]

  const handleMenuClick = (href: string) => {
    router.push(href)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Kelompokkan menuItems berdasarkan group
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = []
    }
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200/60 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">v2.0.0</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {Object.entries(groupedMenuItems).map(([group, items]) => (
          <div key={group} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group}
              </h3>
            )}
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-cyan-700 border border-cyan-200/50'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <div className={`flex-shrink-0 ${isActive ? 'text-cyan-600' : 'text-gray-400'}`}>
                        {item.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.label}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-200/60 p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {loading ? (
                <>
                  <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </>
              ) : error ? (
                <div className="flex items-center gap-3 text-red-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Error loading</p>
                    <button 
                      onClick={fetchUserProfile}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : user ? (
                <>
                  {user.imagePath ? (
                    <img 
                      src={user.imagePath} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </>
              ) : null}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Collapsed User Profile */}
            {loading ? (
              <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse mx-auto"></div>
            ) : error ? (
              <button 
                onClick={fetchUserProfile}
                className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto hover:bg-red-200 transition-colors"
                title="Error - Click to retry"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            ) : user ? (
              user.imagePath ? (
                <img 
                  src={user.imagePath} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover mx-auto"
                  title={`${user.name} (${user.email})`}
                />
              ) : (
                <div 
                  className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto"
                  title={`${user.name} (${user.email})`}
                >
                  <span className="text-white text-xs font-medium">
                    {getInitials(user.name)}
                  </span>
                </div>
              )
            ) : null}

            {/* Collapsed Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full p-2 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}