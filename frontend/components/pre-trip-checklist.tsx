"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { updateItinerary } from "@/lib/data"
import type { PreTripChecklistItem } from "@/lib/models"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PreTripChecklistProps {
  itineraryId: string
  initialChecklist: PreTripChecklistItem[]
  isAdmin: boolean
}

export function PreTripChecklist({ itineraryId, initialChecklist, isAdmin }: PreTripChecklistProps) {
  const [checklist, setChecklist] = useState<PreTripChecklistItem[]>(initialChecklist)
  const [newChecklistItem, setNewChecklistItem] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setChecklist(initialChecklist)
  }, [initialChecklist])

  const handleToggle = async (id: string) => {
    const updatedChecklist = checklist.map((item) => (item._id === id ? { ...item, completed: !item.completed } : item))
    setChecklist(updatedChecklist)

    if (!isAdmin) {
      try {
        await updateItinerary(itineraryId, { preTripChecklist: updatedChecklist })
        toast({
          title: "Checklist Updated",
          description: "Your pre-trip checklist has been updated.",
        })
      } catch (error) {
        console.error("Failed to update checklist:", error)
        toast({
          title: "Error",
          description: "Failed to update checklist. Please try again.",
          variant: "destructive",
        })
        // Revert on error
        setChecklist(initialChecklist)
      }
    }
  }

  const handleAddChecklistItem = async () => {
    if (newChecklistItem.trim() === "") return

    const newItem: PreTripChecklistItem = {
      _id: `temp-${Date.now()}`, // Temporary ID for UI
      item: newChecklistItem.trim(),
      completed: false,
    }

    const updatedChecklist = [...checklist, newItem]
    setChecklist(updatedChecklist)
    setNewChecklistItem("")

    try {
      const response = await updateItinerary(itineraryId, { preTripChecklist: updatedChecklist })
      if (response) {
        // Replace temporary ID with actual ID from backend if available
        const finalChecklist = updatedChecklist.map((item) =>
          item._id === newItem._id
            ? { ...item, _id: response.preTripChecklist?.find((i) => i.item === newItem.item)?._id || item._id }
            : item,
        )
        setChecklist(finalChecklist)
        toast({
          title: "Item Added",
          description: "New checklist item added successfully.",
        })
      } else {
        throw new Error("Failed to add item to backend")
      }
    } catch (error) {
      console.error("Failed to add checklist item:", error)
      toast({
        title: "Error",
        description: "Failed to add checklist item. Please try again.",
        variant: "destructive",
      })
      // Revert on error
      setChecklist(initialChecklist)
    }
  }

  const handleDeleteChecklistItem = async (id: string) => {
    const updatedChecklist = checklist.filter((item) => item._id !== id)
    setChecklist(updatedChecklist)

    try {
      await updateItinerary(itineraryId, { preTripChecklist: updatedChecklist })
      toast({
        title: "Item Removed",
        description: "Checklist item removed successfully.",
      })
    } catch (error) {
      console.error("Failed to delete checklist item:", error)
      toast({
        title: "Error",
        description: "Failed to remove checklist item. Please try again.",
        variant: "destructive",
      })
      // Revert on error
      setChecklist(initialChecklist)
    }
  }

  const completedItems = checklist.filter((item) => item.completed).length
  const totalItems = checklist.length
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex space-x-2">
          <Input
            placeholder="Add new checklist item"
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddChecklistItem()
              }
            }}
          />
          <Button onClick={handleAddChecklistItem}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
      )}

      {checklist.length === 0 && <p className="text-muted-foreground">No checklist items yet.</p>}

      <div className="space-y-2">
        {checklist.map((item) => (
          <div key={item._id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`item-${item._id}`}
                checked={item.completed}
                onCheckedChange={() => handleToggle(item._id)}
                disabled={isAdmin && !item._id.startsWith("temp-")} // Disable checkbox for admin if not a new item
              />
              <label
                htmlFor={`item-${item._id}`}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  item.completed ? "text-green-600 dark:text-green-400" : "",
                )}
              >
                {item.item}
              </label>
            </div>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteChecklistItem(item._id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {totalItems > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress:</span>
            <span>
              {completedItems}/{totalItems} items completed
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  )
}
