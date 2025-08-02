'use client'

import StatsCard from './StatsCard'
import { useEffect, useState } from 'react'

// Fungsi bantu untuk mengubah string SVG menjadi React element
function parseSvg(svgString: string) {
  return <span dangerouslySetInnerHTML={{ __html: svgString }} />
}

interface StatItem {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: string
  bgColor: string
  iconColor: string
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
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
            change={stat.change}
            changeType={stat.changeType === 'neutral' ? 'positive' : stat.changeType} // fallback to positive for neutral style
            icon={parseSvg(stat.icon)}
          />
        ))
      )}
    </div>
  )
}
