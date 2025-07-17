"use client"

import { ToastProvider, ToastViewport } from "@radix-ui/react-toast"
import { useToast } from "@/hooks/use-toast"
import { Toast } from "./ui/toast" // Assuming you have a Toast component

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <Toast.Title>{title}</Toast.Title>}
            {description && <Toast.Description>{description}</Toast.Description>}
          </div>
          {action}
          <Toast.Close />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
