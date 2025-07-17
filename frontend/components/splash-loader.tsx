"use client"

import { useEffect, useState } from "react"
import Lottie from "lottie-react"
import travelAnimation from "@/public/lottie/travel-animation.json" // Assuming you have this Lottie JSON file

export default function SplashLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Display for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <Lottie animationData={travelAnimation} loop={true} autoplay={true} className="h-64 w-64" />
        <p className="mt-4 text-lg font-semibold text-primary-foreground">Planning your next adventure...</p>
      </div>
    </div>
  )
}
