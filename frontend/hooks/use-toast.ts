"use client"
import { useToast as useToastOriginal } from "@/components/ui/toast"

type ToastType = "default" | "success" | "error" | "warning" | "info" | "destructive"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastType
}

// Re-export the useToast hook
const useToast = useToastOriginal

// Export a standalone toast function for easier usage
const toastFunction = (title: string, description?: string, variant?: ToastType) => {
  const toastHook = useToastOriginal()
  return toastHook.toast({ title, description, variant })
}

// Export the original hook as default
export default useToast

// Export the standalone toast function
export const toast = toastFunction
