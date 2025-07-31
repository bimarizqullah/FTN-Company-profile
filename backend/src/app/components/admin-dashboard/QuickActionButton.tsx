// components/QuickActionButton.tsx
'use client'

interface QuickActionButtonProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick?: () => void
}

export default function QuickActionButton({
  title,
  description,
  icon,
  onClick
}: QuickActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200/60 hover:border-gray-300/60 group"
    >
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200/60 group-hover:border-amber-200 group-hover:bg-amber-50 transition-all duration-200">
        <div className="text-gray-600 group-hover:text-amber-600 transition-colors duration-200">
          {icon}
        </div>
      </div>
      <div className="text-left flex-1">
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </button>
  )
}