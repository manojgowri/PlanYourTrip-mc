"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SplashLoader } from "@/components/splash-loader"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Simulate a loading delay for the splash screen
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // 2 seconds loading time
    return () => clearTimeout(timer)
  }, [])

  const isAdminRoute = pathname.startsWith("/admin")
  const isLoginRoute = pathname === "/login"

  if (loading && !isLoginRoute) {
    return <SplashLoader />
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginRoute && <Header isAdminRoute={isAdminRoute} />}
      <main className="flex-1">{children}</main>
      {!isLoginRoute && <Footer />}
      <OfflineIndicator />
    </div>
  )
}
