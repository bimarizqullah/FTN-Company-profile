// components/QuickActionButton.tsx
'use client'

interface QuickActionButtonProps {
  title: string
  description: string
  icon: React.ReactNode
  bgColor: string
  hoverColor: string
  iconBgColor: string
  onClick?: () => void
}

export default function QuickActionButton({
  title,
  description,
  icon,
  bgColor,
  hoverColor,
  iconBgColor,
  onClick
}: QuickActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center space-x-3 p-4 ${bgColor} ${hoverColor} rounded-xl transition-colors duration-200`}
    >
      <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <div className="text-left">
        <p className="font-medium text-slate-800">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </button>
  )
}
