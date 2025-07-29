// components/LoadingSpinner.tsx
'use client'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}