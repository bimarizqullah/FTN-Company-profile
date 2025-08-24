'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'
import { ROLES } from '@/constants/roles'
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  KeyIcon,
  UserGroupIcon,
  ShieldExclamationIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  Squares2X2Icon,
  BriefcaseIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  Cog6ToothIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline'

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
  group: string
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
        if (response.status === 401 || response.status === 403) {
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
      icon: <HomeIcon className="w-5 h-5" />,
      href: '/dashboard',
      group: 'General',
    },
    {
      id: 'users',
      label: 'Users',
      icon: <UsersIcon className="w-5 h-5" />,
      href: '/dashboard/users',
      group: 'User Management',
    },
    {
      id: 'role',
      label: 'Role',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      href: '/dashboard/role',
      group: 'User Management',
    },
    {
      id: 'permission',
      label: 'Permission',
      icon: <KeyIcon className="w-5 h-5" />,
      href: '/dashboard/permission',
      group: 'User Management',
    },
    {
      id: 'user-role',
      label: 'User Roles',
      icon: <UserGroupIcon className="w-5 h-5" />,
      href: '/dashboard/user-role',
      group: 'User Management',
    },
    {
      id: 'role-permission',
      label: 'Role Permission',
      icon: <ShieldExclamationIcon className="w-5 h-5" />,
      href: '/dashboard/role-permission',
      group: 'User Management',
    },
    {
      id: 'managements',
      label: 'Official Management',
      icon: <BuildingOfficeIcon className="w-5 h-5" />,
      href: '/dashboard/management',
      group: 'Content Management',
    },
    {
      id: 'sliders',
      label: 'Sliders',
      icon: <PhotoIcon className="w-5 h-5" />,
      href: '/dashboard/sliders',
      group: 'Content Management',
    },
    {
      id: 'gallery',
      label: 'Galleries',
      icon: <Squares2X2Icon className="w-5 h-5" />,
      href: '/dashboard/gallery',
      group: 'Content Management',
    },
    {
      id: 'services',
      label: 'Services',
      icon: <BriefcaseIcon className="w-5 h-5" />,
      href: '/dashboard/services',
      group: 'Content Management',
    },
    {
      id: 'projects',
      label: 'Project',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      href: '/dashboard/projects',
      group: 'Content Management',
    },
    {
      id: 'contacts',
      label: 'Contact',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      href: '/dashboard/contact',
      group: 'Contact Management',
    },
    {
      id: 'offices',
      label: 'Office',
      icon: <BuildingOffice2Icon className="w-5 h-5" />,
      href: '/dashboard/office',
      group: 'Contact Management',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      href: '/settings',
      group: 'Configuration',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <UserIcon className="w-5 h-5" />,
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

  // Filter grup berdasarkan role pengguna
  const filteredGroupedMenuItems = Object.entries(
    menuItems.reduce((acc, item) => {
      if (item.group === 'User Management' && (!user || !user.roles.includes(ROLES.SUPERADMIN))) {
        return acc
      }
      if (!acc[item.group]) {
        acc[item.group] = []
      }
      acc[item.group].push(item)
      return acc
    }, {} as Record<string, MenuItem[]>)
  )

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200/60 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/60 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
              <img src="/asset/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
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
          <ChevronLeftIcon 
            className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        {filteredGroupedMenuItems.map(([group, items]) => (
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

      {/* User Profile & Logout - Fixed */}
      <div className="border-t border-gray-200/60 p-4 flex-shrink-0">
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
                  <ExclamationTriangleIcon className="w-8 h-8" />
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
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
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
                <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
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
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mx-auto" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}