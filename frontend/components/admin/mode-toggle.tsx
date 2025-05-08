"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ModeToggleProps {
  initialMode?: "edit" | "view"
  onChange?: (mode: "edit" | "view") => void
}

export function ModeToggle({ initialMode = "view", onChange }: ModeToggleProps) {
  const [mode, setMode] = useState<"edit" | "view">(initialMode)

  const handleToggle = () => {
    const newMode = mode === "view" ? "edit" : "view"
    setMode(newMode)
    if (onChange) {
      onChange(newMode)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch id="mode-toggle" checked={mode === "edit"} onCheckedChange={handleToggle} />
      <Label htmlFor="mode-toggle" className="text-sm font-medium">
        {mode === "edit" ? "Edit Mode" : "View Mode"}
      </Label>
    </div>
  )
}
