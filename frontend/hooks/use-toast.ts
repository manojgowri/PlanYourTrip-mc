"use client"

import { useState, useCallback } from "react"

type ToastType = "default" | "success" | "error" | "warning" | "info" | "destructive"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return { toast, dismiss, toasts }
}

// Export a standalone toast function for easier usage in server components
export const toast = {
  success: (title: string, description?: string) => {
    console.log(`Toast success: ${title} - ${description}`)
    // This is just a placeholder for server components
    // The actual toast will be shown by the client component
    return { id: Math.random().toString(36).substring(2, 9) }
  },
  error: (title: string, description?: string) => {
    console.log(`Toast error: ${title} - ${description}`)
    // This is just a placeholder for server components
    return { id: Math.random().toString(36).substring(2, 9) }
  },
  warning: (title: string, description?: string) => {
    console.log(`Toast warning: ${title} - ${description}`)
    // This is just a placeholder for server components
    return { id: Math.random().toString(36).substring(2, 9) }
  },
  info: (title: string, description?: string) => {
    console.log(`Toast info: ${title} - ${description}`)
    // This is just a placeholder for server components
    return { id: Math.random().toString(36).substring(2, 9) }
  },
}
