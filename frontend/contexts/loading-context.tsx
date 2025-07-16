"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface LoadingContextType {
  isLoading: boolean
  loadingMessage: string
  setLoading: (loading: boolean) => void
  setLoadingMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Loading...")

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const setLoadingMessageState = (message: string) => {
    setLoadingMessage(message)
  }

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        setLoading,
        setLoadingMessage: setLoadingMessageState,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
