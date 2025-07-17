"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"

interface SafeImageProps extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string
}

export function SafeImage({
  src,
  fallbackSrc = "/placeholder.svg?height=100&width=100",
  alt,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc)
        }
      }}
      {...props}
    />
  )
}
