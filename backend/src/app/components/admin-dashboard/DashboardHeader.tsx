'use client'

interface DashboardHeaderProps {
  onLogout: () => void
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200/60 sticky top-0 z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
              <img src="/asset/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div> 
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500">Welcome back</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all duration-200 border border-gray-200/60 hover:border-gray-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}