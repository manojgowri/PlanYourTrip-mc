"use client"

import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react"

interface SaveChangesButtonProps {
  onClick: () => Promise<void>
}

export function SaveChangesButton({ onClick }: SaveChangesButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleClick = async () => {
    setIsSaving(true)
    setIsSaved(false)
    try {
      await onClick()
      setIsSaved(true)
    } catch (error) {
      console.error("Error saving changes:", error)
      setIsSaved(false) // Indicate save failed
    } finally {
      setIsSaving(false)
      setTimeout(() => setIsSaved(false), 2000) // Reset saved state after 2 seconds
    }
  }

  return (
    <Button onClick={handleClick} disabled={isSaving}>
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : isSaved ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Saved!
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  )
}
