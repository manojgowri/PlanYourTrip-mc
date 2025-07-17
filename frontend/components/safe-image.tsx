"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SafeImageProps extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string
}

export function SafeImage({ src, alt, className, fallbackSrc = "/placeholder.svg", ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  const handleError = () => {
    if (!error) {
      setImgSrc(fallbackSrc)
      setError(true)
    }
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      className={cn("object-cover", className)}
      onError={handleError}
      {...props}
    />
  )
}
