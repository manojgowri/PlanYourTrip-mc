"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial status
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 text-center flex items-center justify-center gap-2 z-50 shadow-lg"
        >
          <WifiOff className="h-5 w-5" />
          <span>You are currently offline. Some features may be limited.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
