"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { markItineraryAsComplete } from "@/lib/data"

interface CompleteStatusButtonProps {
  itineraryId: string
  itineraryName: string
  onComplete?: () => void
}

export function CompleteStatusButton({ itineraryId, itineraryName, onComplete }: CompleteStatusButtonProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      await markItineraryAsComplete(itineraryId)

      toast({
        title: "Trip marked as complete",
        description: `${itineraryName} has been marked as completed.`,
      })

      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error("Error marking trip as complete:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the trip status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" className="gap-1" onClick={handleComplete} disabled={isLoading}>
      <Check className="h-4 w-4" />
      {isLoading ? "Updating..." : "Complete"}
    </Button>
  )
}
