'use client'

import StatsCard from './StatsCard'
import { useEffect, useState } from 'react'
import { 
  UsersIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface StatItem {
  title: string
  value: string
  iconType: string
  bgColor: string
  iconColor: string
}

// Fungsi untuk mendapatkan icon berdasarkan iconType
function getIcon(iconType: string) {
  switch (iconType) {
    case 'users':
      return <UsersIcon className="w-6 h-6" />
    case 'folder':
      return <FolderIcon className="w-6 h-6" />
    case 'wrench-screwdriver':
      return <WrenchScrewdriverIcon className="w-6 h-6" />
    case 'photo':
      return <PhotoIcon className="w-6 h-6" />
    case 'chat-bubble-left-right':
      return <ChatBubbleLeftRightIcon className="w-6 h-6" />
    default:
      return <UsersIcon className="w-6 h-6" />
  }
}

export default function StatsGrid() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/summary/stats')
        const json = await res.json()
        setStats(json.data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
      {loading ? (
        Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-[100px] bg-gray-100 rounded-xl animate-pulse" />
        ))
      ) : (
        stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={getIcon(stat.iconType)}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
          />
        ))
      )}
    </div>
  )
}
