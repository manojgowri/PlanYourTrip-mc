"use client"

import type React from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

interface CustomLoaderProps {
  message?: string
}

export const CustomLoader: React.FC<CustomLoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32">
          <DotLottieReact
            src="https://lottie.host/49b832c5-95a4-4f21-976f-66e1346942af/QU8krWWhDK.lottie"
            loop
            autoplay
          />
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  )
}
