"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useState } from "react"

interface SaveChangesButtonProps {
  onClick: () => Promise<void> | void
  label?: string
}

export function SaveChangesButton({ onClick, label = "Save Changes" }: SaveChangesButtonProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleClick = async () => {
    setIsSaving(true)
    try {
      await onClick()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isSaving}>
      {isSaving ? (
        <>
          <span className="animate-spin mr-2">⚙️</span> Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" /> {label}
        </>
      )}
    </Button>
  )
}
