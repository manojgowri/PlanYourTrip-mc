"use client"

import type React from "react"

import { SimpleLoader } from "@/components/simple-loader"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <SimpleLoader />
  }

  if (status === "authenticated") {
    return <>{children}</>
  }

  return <SimpleLoader />
}
