// components/StatsCard.tsx
'use client'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  changeType: 'positive' | 'negative'
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-gray-600">
            {icon}
          </div>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-md ${
          changeType === 'positive' 
            ? 'text-emerald-700 bg-emerald-50' 
            : 'text-red-700 bg-red-50'
        }`}>
          {change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  )
}