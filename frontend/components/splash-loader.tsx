"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Lottie from "lottie-react"
import animationData from "@/public/lottie/travel-loader.json" // Corrected path to the Lottie JSON file

export default function SplashLoader() {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith("/admin")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAdminPage) {
      setIsLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Show loader for 2 seconds

    return () => clearTimeout(timer)
  }, [isAdminPage])

  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="w-64 h-64">
        <Lottie animationData={animationData} loop={true} autoplay={true} />
      </div>
    </div>
  )
}
