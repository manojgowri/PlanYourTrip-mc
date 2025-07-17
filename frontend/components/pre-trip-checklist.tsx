"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { updateChecklistItem } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { ChecklistItem } from "@/lib/models"

interface PreTripChecklistProps {
  itineraryId: string
  initialChecklist: ChecklistItem[]
  isAdmin: boolean
}

export function PreTripChecklist({ itineraryId, initialChecklist, isAdmin }: PreTripChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist)
  const { toast } = useToast()

  useEffect(() => {
    setChecklist(initialChecklist)
  }, [initialChecklist])

  const handleToggleItem = async (itemId: string, currentCompletedStatus: boolean) => {
    if (isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Checklist items can only be updated by users in view mode.",
        variant: "default",
      })
      return
    }

    const newCompletedStatus = !currentCompletedStatus

    // Optimistic update
    setChecklist((prev) =>
      prev.map((item) => (item._id === itemId ? { ...item, completed: newCompletedStatus } : item)),
    )

    try {
      const updatedItinerary = await updateChecklistItem(itineraryId, itemId, newCompletedStatus)
      if (!updatedItinerary) {
        throw new Error("Failed to update checklist item on server.")
      }
      toast({
        title: "Checklist Updated",
        description: `Item "${checklist.find((item) => item._id === itemId)?.item}" marked as ${newCompletedStatus ? "completed" : "incomplete"}.`,
      })
    } catch (error) {
      console.error("Error updating checklist item:", error)
      toast({
        title: "Error",
        description: "Failed to update checklist. Please try again.",
        variant: "destructive",
      })
      // Revert optimistic update on error
      setChecklist((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, completed: currentCompletedStatus } : item)),
      )
    }
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="grid gap-3">
          {checklist.length > 0 ? (
            checklist.map((item) => (
              <div key={item._id} className="flex items-center space-x-2">
                <Checkbox
                  id={`item-${item._id}`}
                  checked={item.completed}
                  onCheckedChange={() => handleToggleItem(item._id, item.completed)}
                  disabled={isAdmin}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor={`item-${item._id}`}
                  className={`text-base font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {item.item}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center">No checklist items available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
