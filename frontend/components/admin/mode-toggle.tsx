"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ModeToggleProps {
  initialAdminMode?: boolean
  onToggle?: (isAdmin: boolean) => void
}

export function ModeToggle({ initialAdminMode = false, onToggle }: ModeToggleProps) {
  const [isAdminMode, setIsAdminMode] = useState(initialAdminMode)
  const { toast } = useToast()

  const toggleMode = () => {
    const newMode = !isAdminMode
    setIsAdminMode(newMode)
    onToggle?.(newMode)
    toast({
      title: "Mode Changed",
      description: `You are now in ${newMode ? "Admin Mode" : "View Mode"}.`,
      variant: "default",
    })
  }

  return (
    <Button
      variant="outline"
      onClick={toggleMode}
      className={isAdminMode ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
    >
      {isAdminMode ? (
        <>
          <EyeOff className="h-4 w-4 mr-2" /> Admin Mode
        </>
      ) : (
        <>
          <Eye className="h-4 w-4 mr-2" /> View Mode
        </>
      )}
    </Button>
  )
}
