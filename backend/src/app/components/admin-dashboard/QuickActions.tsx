'use client'

import QuickActionButton from './QuickActionButton'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  Cog6ToothIcon,
  UserIcon
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

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}

export default function QuickActions() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const actions: QuickAction[] = [
    {
      title: 'Dashboard',
      description: 'View your admin dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard'),
    },
    {
      title: 'Users',
      description: 'Manage user accounts',
      icon: <UsersIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/users'),
    },
    {
      title: 'Role',
      description: 'Manage user roles',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/role'),
    },
    {
      title: 'Permission',
      description: 'Manage permissions',
      icon: <KeyIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/permission'),
    },
    {
      title: 'User Roles',
      description: 'Assign roles to users',
      icon: <UserGroupIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/user-role'),
    },
    {
      title: 'Role Permission',
      description: 'Assign permissions to roles',
      icon: <ShieldExclamationIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/role-permission'),
    },
    {
      title: 'Official Management',
      description: 'Manage official content',
      icon: <BuildingOfficeIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/management'),
    },
    {
      title: 'Sliders',
      description: 'Manage sliders',
      icon: <PhotoIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/sliders'),
    },
    {
      title: 'Galleries',
      description: 'Manage gallery content',
      icon: <Squares2X2Icon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/gallery'),
    },
    {
      title: 'Services',
      description: 'Manage services',
      icon: <BriefcaseIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/services'),
    },
    {
      title: 'Project',
      description: 'Manage projects',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/projects'),
    },
    {
      title: 'Settings',
      description: 'Manage application settings',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/settings'),
    },
    {
      title: 'My Profile',
      description: 'View and edit your profile',
      icon: <UserIcon className="w-5 h-5" />,
      onClick: () => router.push('/dashboard/profile'),
    },
  ]

  // Filter actions based on user role
  const filteredActions = actions.filter((action) => {
    if (
      [
        'Users',
        'Role',
        'Permission',
        'User Roles',
        'Role Permission',
      ].includes(action.title) &&
      (!user || !user.roles.includes(ROLES.SUPERADMIN))
    ) {
      return false
    }
    return true
  })

  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredActions.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </div>
    </div>
  )
}