"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { markItineraryAsComplete } from "@/lib/data"

interface CompleteStatusButtonProps {
  itineraryId: string
  isCompleted: boolean
  onStatusChange?: (isCompleted: boolean) => void
}

export function CompleteStatusButton({ itineraryId, isCompleted, onStatusChange }: CompleteStatusButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState(isCompleted)
  const { toast } = useToast()

  const handleToggleStatus = async () => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      const updatedItinerary = await markItineraryAsComplete(itineraryId)

      if (updatedItinerary) {
        const newStatus = updatedItinerary.status === "completed"
        setStatus(newStatus)

        if (onStatusChange) {
          onStatusChange(newStatus)
        }

        toast({
          title: newStatus ? "Marked as completed" : "Marked as active",
          variant: "success",
        })
      } else {
        toast({
          title: "Failed to update status",
          description: "Please try again later",
          variant: "error",
        })
      }
    } catch (error) {
      toast({
        title: "Error updating status",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "error",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Button
      onClick={handleToggleStatus}
      disabled={isUpdating}
      variant={status ? "outline" : "default"}
      className="flex items-center gap-2"
    >
      <CheckCircle size={16} className={status ? "text-green-500" : ""} />
      {isUpdating ? "Updating..." : status ? "Completed" : "Mark as Complete"}
    </Button>
  )
}
