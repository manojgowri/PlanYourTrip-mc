"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You are back online!",
        description: "Your connection has been restored.",
        variant: "default",
      })
    }
    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You are offline!",
        description: "Some features may not be available.",
        variant: "destructive",
      })
    }

    // Set initial status
    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  if (isOnline) {
    return null // Don't show anything if online
  }

  return (
    <Badge variant="destructive" className="flex items-center gap-1">
      <WifiOff className="h-4 w-4" />
      Offline
    </Badge>
  )
}
