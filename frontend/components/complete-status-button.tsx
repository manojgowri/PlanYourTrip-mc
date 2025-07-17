"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { markItineraryAsComplete } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface CompleteStatusButtonProps {
  itineraryId: string
  initialStatus: "planning" | "booked" | "completed" | "cancelled" | "online"
  onStatusChange: () => void // Callback to refresh data
}

export function CompleteStatusButton({ itineraryId, initialStatus, onStatusChange }: CompleteStatusButtonProps) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus)
  const { toast } = useToast()

  const handleToggleComplete = async () => {
    try {
      const updatedItinerary = await markItineraryAsComplete(itineraryId)
      setCurrentStatus(updatedItinerary.status)
      toast({
        title: "Status Updated",
        description: `Itinerary marked as ${updatedItinerary.status}.`,
      })
      onStatusChange() // Trigger data refresh in parent
    } catch (error) {
      console.error("Failed to update itinerary status:", error)
      toast({
        title: "Error",
        description: "Failed to update itinerary status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isCompleted = currentStatus === "completed"

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isCompleted ? "default" : "secondary"}>{currentStatus}</Badge>
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggleComplete}
        className="h-8 w-8 bg-transparent"
        title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
      >
        {isCompleted ? (
          <XCircle className="h-4 w-4 text-red-500" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
        <span className="sr-only">{isCompleted ? "Mark as Incomplete" : "Mark as Complete"}</span>
      </Button>
    </div>
  )
}
