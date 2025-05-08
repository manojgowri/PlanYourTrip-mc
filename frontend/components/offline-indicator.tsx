"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { isOffline, registerConnectivityListeners } from "@/lib/offline-utils"

export function OfflineIndicator() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    // Set initial state
    setOffline(isOffline())

    // Register listeners for online/offline events
    const cleanup = registerConnectivityListeners(
      () => setOffline(true),
      () => setOffline(false),
    )

    return cleanup
  }, [])

  if (!offline) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-4 py-2 rounded-md shadow-md">
      <WifiOff size={16} />
      <span className="text-sm font-medium">You are offline. Some features may be limited.</span>
    </div>
  )
}
