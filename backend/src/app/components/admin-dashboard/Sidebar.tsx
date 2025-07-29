'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  roles: string[]
  avatar?: string // This will be mapped from imagePath
  status?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Fetch user profile data from API
  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
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

  // Load user profile on component mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Optional: Call logout API to invalidate token on server
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(console.error) // Don't block logout if API call fails
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Always remove token and redirect
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/dashboard',
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
    },
    {
      id: 'products',
      label: 'Products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      href: '/products',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      href: '/orders',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/analytics',
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
    },
  ]

  const handleMenuClick = (href: string) => {
    router.push(href)
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Admin Panel</h2>
              <p className="text-xs text-slate-500">v1.0.0</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg 
            className={`w-4 h-4 text-slate-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-slate-200 p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* User Profile */}
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              {loading ? (
                // Loading skeleton
                <>
                  <div className="w-8 h-8 bg-slate-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-slate-300 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </>
              ) : error ? (
                // Error state
                <div className="flex items-center space-x-3 text-red-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Error loading profile</p>
                    <button 
                      onClick={fetchUserProfile}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : user ? (
                // User profile loaded
                <>
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </>
              ) : null}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Collapsed User Profile */}
            {loading ? (
              <div className="w-8 h-8 bg-slate-300 rounded-full animate-pulse mx-auto"></div>
            ) : error ? (
              <button 
                onClick={fetchUserProfile}
                className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto hover:bg-red-200 transition-colors"
                title="Error loading profile - Click to retry"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            ) : user ? (
              user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover mx-auto"
                  title={`${user.name} (${user.email})`}
                />
              ) : (
                <div 
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto"
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
              className="w-full p-2 text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}