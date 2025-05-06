"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "destructive"
  onDismiss: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onDismiss(id), 300) // Allow time for exit animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onDismiss])

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
      case "destructive":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
      case "error":
      case "destructive":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
      default:
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`rounded-lg border p-4 shadow-md ${getBgColor()}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <h4 className="font-medium">{title}</h4>
              {description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>}
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onDismiss(id), 300)
              }}
              className="flex-shrink-0 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
