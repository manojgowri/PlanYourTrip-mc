"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export function SplashLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Do not show loader on admin pages
    if (pathname.startsWith("/admin")) {
      setIsLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Display for 2 seconds

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32">
          <DotLottieReact
            src="https://lottie.host/49b832c5-95a4-4f21-976f-66e1346942af/QU8krWWhDK.lottie"
            loop
            autoplay
          />
        </div>
        <p className="text-lg font-medium text-muted-foreground animate-pulse">Loading your travel experience...</p>
      </div>
    </div>
  )
}
