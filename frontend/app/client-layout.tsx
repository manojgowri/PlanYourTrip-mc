"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { checkOfflineStatus, checkLanguagePreference } from "@/lib/offline-utils" // Assuming offline-utils handles language too
import { OfflineIndicator } from "@/components/offline-indicator"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // Example of client-side checks
    const isOffline = checkOfflineStatus()
    if (isOffline) {
      toast({
        title: "Offline Mode",
        description: "You are currently offline. Some features may be limited.",
        variant: "default",
      })
    }

    const language = checkLanguagePreference()
    console.log("Current language preference:", language)

    // You might want to add more client-side logic here,
    // like analytics, service worker registration, etc.
  }, [pathname, toast])

  return (
    <>
      <OfflineIndicator />
      {children}
    </>
  )
}
