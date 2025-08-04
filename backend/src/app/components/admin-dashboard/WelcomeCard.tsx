// components/WelcomeCard.tsx
'use client'

interface User {
  imagePath: string
  name: string
  email: string
  roles: string[]
}

interface WelcomeCardProps {
  user: User
}

export default function WelcomeCard({ user }: WelcomeCardProps) {
  console.log("USER:", user)
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
          <img
            src={user.imagePath}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">Role:</span>
            <div className="flex gap-1">
              {user?.roles?.map((role, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                >
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