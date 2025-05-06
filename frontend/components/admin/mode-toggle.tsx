"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff } from "lucide-react"

interface ModeToggleProps {
  initialMode?: boolean
  onChange?: (isOffline: boolean) => void
}

export function ModeToggle({ initialMode = false, onChange }: ModeToggleProps) {
  const [isOffline, setIsOffline] = useState(initialMode)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Check localStorage for saved mode
    const savedMode = localStorage.getItem("offlineMode")
    if (savedMode) {
      setIsOffline(savedMode === "true")
    }
  }, [])

  const toggleMode = () => {
    const newMode = !isOffline
    setIsOffline(newMode)
    localStorage.setItem("offlineMode", String(newMode))

    if (onChange) {
      onChange(newMode)
    }
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="opacity-0">
        Toggle Mode
      </Button>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleMode} className="flex items-center gap-2">
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4 text-amber-500" />
          <span>Offline Mode</span>
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4 text-emerald-500" />
          <span>Online Mode</span>
        </>
      )}
    </Button>
  )
}
