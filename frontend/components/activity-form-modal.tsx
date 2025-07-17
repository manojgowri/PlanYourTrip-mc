"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActivityForm } from "@/components/activity-form"
import { addActivity, updateActivity } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { Activity } from "@/lib/models"

interface ActivityFormModalProps {
  isOpen: boolean
  onClose: () => void
  itineraryId: string
  dayIndex: number
  initialActivity?: Activity | null
}

export function ActivityFormModal({ isOpen, onClose, itineraryId, dayIndex, initialActivity }: ActivityFormModalProps) {
  const { toast } = useToast()

  const handleSubmit = async (activityData: Activity) => {
    try {
      if (initialActivity && initialActivity._id) {
        // Update existing activity
        await updateActivity(itineraryId, dayIndex, initialActivity._id, activityData)
        toast({
          title: "Activity Updated",
          description: "Activity details saved successfully.",
        })
      } else {
        // Add new activity
        await addActivity(itineraryId, dayIndex, activityData)
        toast({
          title: "Activity Added",
          description: "New activity added to the itinerary.",
        })
      }
      onClose() // Close modal and trigger refresh in parent
    } catch (error) {
      console.error("Failed to save activity:", error)
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
        </DialogHeader>
        <ActivityForm initialData={initialActivity} onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
