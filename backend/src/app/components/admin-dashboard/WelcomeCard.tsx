// components/WelcomeCard.tsx
'use client'

interface User {
  name: string
  email: string
  roles: string[]
}

interface WelcomeCardProps {
  user: User
}

export default function WelcomeCard({ user }: WelcomeCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">Role:</span>
            <div className="flex gap-1">
              {user?.roles?.map((role) => (
                <span key={role} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}