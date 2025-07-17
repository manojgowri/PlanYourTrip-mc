"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateChecklistItem } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { ChecklistItem } from "@/lib/models"
import { Progress } from "@/components/ui/progress"

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

  const completedItems = checklist.filter((item) => item.completed).length
  const totalItems = checklist.length
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Pre-Trip Checklist</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item._id} className="flex items-center gap-2">
              <Checkbox
                id={`checklist-item-${item._id}`}
                checked={item.completed}
                onCheckedChange={() => handleToggleItem(item._id, item.completed)}
                disabled={isAdmin}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
              />
              <Label
                htmlFor={`checklist-item-${item._id}`}
                className={`text-sm font-medium leading-none ${item.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {item.item}
              </Label>
            </li>
          ))}
        </ul>
        {totalItems > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress:</span>
              <span>
                {completedItems}/{totalItems} items completed
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
