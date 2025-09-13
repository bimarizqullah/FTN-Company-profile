// components/StatsCard.tsx
'use client'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  bgColor?: string
  iconColor?: string
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  bgColor = 'bg-gray-50',
  iconColor = 'text-gray-600'
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-5">
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  )
}