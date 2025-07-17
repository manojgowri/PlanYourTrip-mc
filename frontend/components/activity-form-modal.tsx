"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ActivityForm } from "@/components/activity-form"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveActivity } from "@/lib/data"
import type { Activity } from "@/lib/models"

interface ActivityFormModalProps {
  itineraryId: string
  dayId: string
  initialData?: Activity | null
  onSaveSuccess: () => void
}

export function ActivityFormModal({ itineraryId, dayId, initialData, onSaveSuccess }: ActivityFormModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (activityData: Partial<Activity>) => {
    setIsSubmitting(true)
    try {
      const saved = await saveActivity(itineraryId, dayId, activityData as Activity)
      if (saved) {
        toast({
          title: "Success",
          description: "Activity saved successfully!",
        })
        setIsOpen(false)
        onSaveSuccess()
      } else {
        throw new Error("Failed to save activity")
      }
    } catch (error) {
      console.error("Failed to save activity:", error)
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4 bg-transparent">
          <Plus className="mr-2 h-4 w-4" /> {initialData ? "Edit Activity" : "Add Activity"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Activity" : "Add New Activity"}</DialogTitle>
        </DialogHeader>
        <ActivityForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}
