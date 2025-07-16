"use client"

import { useLoading } from "@/contexts/loading-context"
import { CustomLoader } from "./custom-loader"

export function GlobalLoader() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return <CustomLoader />
}
