'use client'

import { useState } from 'react'

interface ImageWithFallbackProps {
  src?: string | null
  alt: string
  fallbackText: string
  className?: string
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  fallbackText, 
  className = "w-8 h-8 rounded-full object-cover" 
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false)

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div className={`bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center ${className}`}>
        <span className="text-white text-xs font-medium">
          {fallbackText}
        </span>
      </div>
    )
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}

