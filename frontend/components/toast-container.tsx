"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { useEffect } from "react"

export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        dismiss(toast.id)
      }, 5000)
    })

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [toasts, dismiss])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md flex justify-between items-start ${
            toast.variant === "error"
              ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
              : toast.variant === "success"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                : toast.variant === "warning"
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          }`}
        >
          <div>
            <h4 className="font-medium">{toast.title}</h4>
            {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={18} />
            <span className="sr-only">Close</span>
          </button>
        </div>
      ))}
    </div>
  )
}
