
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome, {user.name}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-slate-500">Role:</span>
            <div className="flex flex-wrap gap-1">
              {user?.roles?.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
