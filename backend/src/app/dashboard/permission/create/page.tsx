'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/app/components/admin-dashboard/DashboardHeader'
import Sidebar from '@/app/components/admin-dashboard/Sidebar'
import StatsGrid from '@/app/components/admin-dashboard/StatsGrid'
import DynamicForm, { FormConfig } from '@/app/components/admin-dashboard/DynamicForm'

export default function PermissionPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setError('')
    setTimeout(() => router.push('/dashboard/permission'), 1500)
  }

  const handleError = (message: string) => {
    setError(message)
    setSuccess('')
  }

  const formConfig: FormConfig = {
    title: 'Tambah Permission Baru',
    description: 'Buat Permission baru untuk pengguna',
    fields: [
      {
        name: 'permission',
        label: 'Permission',
        type: 'text' as const,
        fetchUrl: '/api/permission',
        displayField: 'permission',
        placeholder: 'Permission',
        required: true,
        value: '',
        readOnly: false,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text' as const,
        fetchUrl: '/api/permission',
        displayField: 'description',
        placeholder: 'description',
        descriptionField: 'description',
        value: '',
        readOnly: false,
      },
    ],
    submitUrl: '/api/permission',
    submitMethod: 'POST',
    redirectUrl: '/dashboard/permission',
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