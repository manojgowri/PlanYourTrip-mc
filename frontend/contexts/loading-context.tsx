"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface LoadingContextType {
  isLoading: boolean
  loadingMessage: string
  setLoading: (loading: boolean) => void
  setLoadingMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadMessage] = useState("Loading...")

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const setLoadingMessage = (message: string) => {
    setLoadMessage(message)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, loadingMessage, setLoading, setLoadingMessage }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
