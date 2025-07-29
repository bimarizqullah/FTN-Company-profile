// components/StatsCard.tsx
'use client'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  changeType: 'positive' | 'negative'
  bgColor: string
  iconColor: string
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType, 
  bgColor, 
  iconColor 
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
    </div>
  )
}
