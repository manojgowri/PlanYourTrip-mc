"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, DollarSign } from "lucide-react"
import { ActivityFormModal } from "@/components/activity-form-modal"
import { deleteActivity } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { SafeImage } from "@/components/safe-image"
import type { Day, Activity } from "@/lib/models"

interface ItineraryActivitiesManagerProps {
  itineraryId: string
  day: Day
  onActivityChange: () => void // Callback to refresh parent data
}

export function ItineraryActivitiesManager({ itineraryId, day, onActivityChange }: ItineraryActivitiesManagerProps) {
  const { toast } = useToast()
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        const success = await deleteActivity(itineraryId, day._id, activityId)
        if (success) {
          toast({
            title: "Success",
            description: "Activity deleted successfully!",
          })
          onActivityChange() // Trigger refresh
        } else {
          throw new Error("Failed to delete activity")
        }
      } catch (error) {
        console.error("Failed to delete activity:", error)
        toast({
          title: "Error",
          description: "Failed to delete activity. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleOpenEditModal = (activity: Activity) => {
    setEditingActivity(activity)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditingActivity(null)
    setIsModalOpen(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Day {day.dayNumber}: {day.date}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {day.activities && day.activities.length > 0 ? (
          <div className="space-y-4">
            {day.activities.map((activity) => (
              <div key={activity._id} className="flex items-start gap-4 p-4 border rounded-lg">
                {activity.image && (
                  <SafeImage
                    src={activity.image}
                    alt={activity.name}
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                  />
                )}
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg">{activity.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.time} - {activity.location}
                  </p>
                  <p className="text-sm mt-1">{activity.description}</p>
                  {activity.cost > 0 && (
                    <p className="text-sm font-medium flex items-center mt-1">
                      <DollarSign className="h-4 w-4 mr-1" /> Cost: ₹{activity.cost.toLocaleString()}
                    </p>
                  )}
                  {activity.type && <p className="text-xs text-blue-600 mt-1">Type: {activity.type}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleOpenEditModal(activity)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Activity</span>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteActivity(activity._id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Activity</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No activities planned for this day.</p>
        )}

        <ActivityFormModal
          itineraryId={itineraryId}
          dayId={day._id}
          initialData={editingActivity}
          onSaveSuccess={() => {
            handleCloseModal()
            onActivityChange()
          }}
        />
      </CardContent>
    </Card>
  )
}
