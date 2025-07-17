"use client"

import Image from "next/image"
import { useState } from "react"

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  fill?: boolean
  sizes?: string
}

export function SafeImage({ src, alt, className, width, height, priority, fill, sizes }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const handleError = () => {
    setImgSrc("/placeholder.svg?height=100&width=100") // Fallback to a generic placeholder
  }

  if (fill) {
    return (
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={className}
        onError={handleError}
        fill
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        priority={priority}
        style={{ objectFit: "cover" }} // Ensure image covers the area
      />
    )
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      className={className}
      onError={handleError}
      width={width || 500} // Provide default width/height if not fill
      height={height || 300} // Provide default width/height if not fill
      priority={priority}
    />
  )
}
