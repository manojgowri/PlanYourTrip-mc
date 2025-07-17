"use client"

import { useState, useEffect } from "react"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, DollarSign, MapPin, Clock } from "lucide-react"
import { deleteActivity } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { Activity } from "@/lib/models"
import { formatCurrency } from "@/lib/currency-utils"

interface ItineraryActivitiesManagerProps {
  itineraryId: string
  dayIndex: number
  initialActivities: Activity[]
  isAdmin: boolean
  onEditActivity: (activity: Activity) => void
}

export function ItineraryActivitiesManager({
  itineraryId,
  dayIndex,
  initialActivities,
  isAdmin,
  onEditActivity,
}: ItineraryActivitiesManagerProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const { toast } = useToast()

  useEffect(() => {
    setActivities(initialActivities)
  }, [initialActivities])

  const handleDeleteActivity = async (activityId: string) => {
    if (!isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Activities can only be deleted by administrators.",
        variant: "default",
      })
      return
    }

    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteActivity(itineraryId, dayIndex, activityId)
        setActivities((prev) => prev.filter((activity) => activity._id !== activityId))
        toast({
          title: "Activity Deleted",
          description: "Activity removed successfully.",
        })
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

  return (
    <CardContent className="p-0">
      {activities.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity._id}>
                <TableCell className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {activity.time}
                </TableCell>
                <TableCell>{activity.name}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {activity.location}
                </TableCell>
                <TableCell className="text-right flex items-center justify-end gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {formatCurrency(activity.cost || 0, "INR")}
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => onEditActivity(activity)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteActivity(activity._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground text-center py-4">No activities planned for this day.</p>
      )}
    </CardContent>
  )
}
