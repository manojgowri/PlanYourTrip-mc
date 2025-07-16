"use client"

import { useLoading } from "@/contexts/loading-context"
import { CustomLoader } from "./custom-loader"

export const GlobalLoader = () => {
  const { isLoading, loadingMessage } = useLoading()

  if (!isLoading) return null

  return <CustomLoader message={loadingMessage} />
}
