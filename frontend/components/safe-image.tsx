"use client"

import { useState, useEffect } from "react"

interface SafeImageProps {
  src: string
  alt: string
  className?: string
}

export function SafeImage({ src, alt, className }: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [error, setError] = useState(false)

  useEffect(() => {
    setImageSrc(src)
    setError(false)
  }, [src])

  const handleError = () => {
    // If the original source fails, try alternative case for extension
    if (!error) {
      setError(true)

      // Try alternative case for extension
      const lastDotIndex = src.lastIndexOf(".")
      if (lastDotIndex !== -1) {
        const basePath = src.substring(0, lastDotIndex)
        const extension = src.substring(lastDotIndex + 1)

        // Try uppercase if original was lowercase, and vice versa
        const newExtension = extension.toLowerCase() === extension ? extension.toUpperCase() : extension.toLowerCase()

        const alternateSrc = `${basePath}.${newExtension}`
        console.log(`Original image failed to load. Trying: ${alternateSrc}`)
        setImageSrc(alternateSrc)
        return
      }

      // If all else fails, use placeholder
      setImageSrc("/placeholder.svg?height=400&width=600")
    }
  }

  return <img src={imageSrc || "/placeholder.svg"} alt={alt} className={className} onError={handleError} />
}
