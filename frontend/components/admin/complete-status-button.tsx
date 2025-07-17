"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { updateItineraryCompletionStatus } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface CompleteStatusButtonProps {
  itineraryId: string
  initialStatus: boolean
}

export function CompleteStatusButton({ itineraryId, initialStatus }: CompleteStatusButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialStatus)
  const { toast } = useToast()

  const handleToggleComplete = async () => {
    const newStatus = !isCompleted
    setIsCompleted(newStatus) // Optimistic update

    try {
      const updatedItinerary = await updateItineraryCompletionStatus(itineraryId, newStatus)
      if (!updatedItinerary) {
        throw new Error("Failed to update completion status on server.")
      }
      toast({
        title: "Itinerary Status Updated",
        description: `Itinerary marked as ${newStatus ? "completed" : "incomplete"}.`,
      })
    } catch (error) {
      console.error("Error updating completion status:", error)
      toast({
        title: "Error",
        description: "Failed to update itinerary status. Please try again.",
        variant: "destructive",
      })
      setIsCompleted(!newStatus) // Revert optimistic update on error
    }
  }

  return (
    <Button
      variant={isCompleted ? "default" : "outline"}
      onClick={handleToggleComplete}
      className={isCompleted ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
    >
      {isCompleted ? (
        <>
          <CheckCircle className="h-4 w-4 mr-2" /> Completed
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 mr-2" /> Mark as Complete
        </>
      )}
    </Button>
  )
}
