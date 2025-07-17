"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { markItineraryAsComplete } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface CompleteStatusButtonProps {
  itineraryId: string
  initialStatus: "online" | "completed" | "draft"
  onStatusChange?: () => void // Callback to refresh data
}

export function CompleteStatusButton({ itineraryId, initialStatus, onStatusChange }: CompleteStatusButtonProps) {
  const [status, setStatus] = useState(initialStatus)
  const { toast } = useToast()

  const handleMarkComplete = async () => {
    try {
      const updatedItinerary = await markItineraryAsComplete(itineraryId)
      if (updatedItinerary) {
        setStatus(updatedItinerary.status)
        toast({
          title: "Success",
          description: `Itinerary marked as ${updatedItinerary.status}!`,
        })
        if (onStatusChange) {
          onStatusChange()
        }
      } else {
        throw new Error("Failed to mark itinerary as complete")
      }
    } catch (error) {
      console.error("Failed to mark itinerary complete:", error)
      toast({
        title: "Error",
        description: "Failed to mark itinerary as complete. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isCompleted = status === "completed"

  return (
    <Button variant={isCompleted ? "secondary" : "default"} onClick={handleMarkComplete} disabled={isCompleted}>
      {isCompleted ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" /> Completed
        </>
      ) : (
        <>
          <XCircle className="mr-2 h-4 w-4" /> Mark as Complete
        </>
      )}
    </Button>
  )
}
