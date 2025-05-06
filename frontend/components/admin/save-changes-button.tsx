"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SaveChangesButtonProps {
  onSave: () => Promise<void>
  isOfflineMode?: boolean
}

export function SaveChangesButton({ onSave, isOfflineMode = false }: SaveChangesButtonProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await onSave()

      toast({
        title: "Changes saved",
        description: isOfflineMode
          ? "Your changes have been saved locally and will sync when you're back online."
          : "Your changes have been saved successfully.",
      })

      // Show success state briefly
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button onClick={handleSave} disabled={isSaving || showSuccess} className="relative">
      {showSuccess ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </>
      )}
    </Button>
  )
}
