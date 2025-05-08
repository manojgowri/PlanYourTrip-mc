"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SaveChangesButtonProps {
  onSave: () => Promise<boolean>
  disabled?: boolean
}

export function SaveChangesButton({ onSave, disabled = false }: SaveChangesButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (disabled || isSaving) return

    setIsSaving(true)
    try {
      const success = await onSave()
      if (success) {
        toast({
          title: "Changes saved successfully",
          variant: "success",
        })
      } else {
        toast({
          title: "Failed to save changes",
          description: "Please try again later",
          variant: "error",
        })
      }
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button onClick={handleSave} disabled={disabled || isSaving} className="flex items-center gap-2" variant="default">
      <Save size={16} />
      {isSaving ? "Saving..." : "Save Changes"}
    </Button>
  )
}
