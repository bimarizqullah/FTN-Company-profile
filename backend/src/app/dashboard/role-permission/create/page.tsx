'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import DynamicForm, { FormConfig } from '@/app/components/admin-dashboard/DynamicForm'

export default function CreateRolePermissionPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setError('')
    setTimeout(() => router.push('/dashboard/role-permission'), 1500)
  }

  const handleError = (message: string) => {
    setError(message)
    setSuccess('')
  }

  const formConfig: FormConfig = {
    title: 'Tambah Role Permission',
    description: 'Buat role baru dengan permission untuk pengguna',
    fields: [
      {
        name: 'roleId',
        label: 'Pilih Role',
        type: 'select' as const,
        fetchUrl: '/api/role',
        displayField: 'role',
        valueField: 'id',
        placeholder: 'Pilih pengguna',
        required: true,
        value: '',
        readOnly: false,
      },
      {
        name: 'permissionIds',
        label: 'Pilih Permission',
        type: 'checkbox-list' as const,
        fetchUrl: '/api/permission',
        displayField: 'permission',
        descriptionField: 'description',
        valueField: 'id',
        value: [],
        readOnly: false,
      },
    ],
    submitUrl: '/api/role-permission',
    submitMethod: 'POST',
    redirectUrl: '/dashboard/role-permission',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64">
          <DashboardHeader onLogout={() => {
            localStorage.removeItem('token')
            router.push('/login')
          }} />
          <main className="text-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <StatsGrid />
            <DynamicForm
              config={formConfig}
              error={error}
              success={success}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </main>
        </div>
      </div>
    </div>
  )
}