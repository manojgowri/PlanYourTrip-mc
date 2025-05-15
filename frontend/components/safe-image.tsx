"use client"

import { useState } from "react"

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  fallbackText?: string
}

export function SafeImage({ src, alt, className = "", fallbackText = "Image not available" }: SafeImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">{fallbackText}</p>
      </div>
    )
  }

  return <img src={src || "/placeholder.svg"} alt={alt} className={className} onError={() => setError(true)} />
}
