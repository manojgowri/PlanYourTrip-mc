"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityFormModal } from "@/components/activity-form-modal"
import type { ItineraryDay, Activity } from "@/lib/models"
import { addActivityToDay, updateActivityInDay, deleteActivityFromDay } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { SafeImage } from "./safe-image"

interface ItineraryActivitiesManagerProps {
  itineraryId: string
  day: ItineraryDay
  isAdmin: boolean
}

export function ItineraryActivitiesManager({ itineraryId, day, isAdmin }: ItineraryActivitiesManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleAddActivity = () => {
    if (!isAdmin) {
      toast({
        title: "View Mode",
        description: "Activities can only be added in Admin Mode.",
        variant: "default",
      })
      return
    }
    setEditingActivity(undefined)
    setIsModalOpen(true)
  }

  const handleEditActivity = (activity: Activity) => {
    if (!isAdmin) {
      toast({
        title: "View Mode",
        description: "Activities can only be edited in Admin Mode.",
        variant: "default",
      })
      return
    }
    setEditingActivity(activity)
    setIsModalOpen(true)
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!isAdmin) {
      toast({
        title: "View Mode",
        description: "Activities can only be deleted in Admin Mode.",
        variant: "default",
      })
      return
    }

    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return
    }

    setIsSubmitting(true)
    try {
      await deleteActivityFromDay(itineraryId, day._id, activityId)
      toast({
        title: "Activity Deleted",
        description: "Activity removed successfully.",
      })
    } catch (error) {
      console.error("Error deleting activity:", error)
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitActivity = async (activityData: Omit<Activity, "_id">) => {
    setIsSubmitting(true)
    try {
      if (editingActivity) {
        await updateActivityInDay(itineraryId, day._id, editingActivity._id, activityData)
        toast({
          title: "Activity Updated",
          description: "Activity details saved successfully.",
        })
      } else {
        await addActivityToDay(itineraryId, day._id, activityData)
        toast({
          title: "Activity Added",
          description: "New activity added to the day.",
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving activity:", error)
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Activities</CardTitle>
        <Button onClick={handleAddActivity} size="sm" disabled={isSubmitting || !isAdmin}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Activity
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {day.activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">No activities planned for this day yet.</p>
        ) : (
          <ul className="space-y-4">
            {day.activities.map((activity) => (
              <li key={activity._id} className="flex items-start gap-4 p-3 border rounded-md">
                {activity.imageUrl && (
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                    <SafeImage src={activity.imageUrl} alt={activity.title} layout="fill" objectFit="cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.time} - {activity.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditActivity(activity)}
                        disabled={isSubmitting || !isAdmin}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit activity</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteActivity(activity._id)}
                        disabled={isSubmitting || !isAdmin}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete activity</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mt-1">{activity.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    {activity.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <ActivityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitActivity}
        initialData={editingActivity}
        isSubmitting={isSubmitting}
      />
    </Card>
  )
}
