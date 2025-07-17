"use client"

import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface SaveChangesButtonProps {
  onSave: () => Promise<void>
  disabled?: boolean
}

export function SaveChangesButton({ onSave, disabled }: SaveChangesButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
      toast({
        title: "Changes Saved",
        description: "Your modifications have been successfully saved.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "Error Saving",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button onClick={handleSave} disabled={disabled || isSaving}>
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" /> Save Changes
        </>
      )}
    </Button>
  )
}
