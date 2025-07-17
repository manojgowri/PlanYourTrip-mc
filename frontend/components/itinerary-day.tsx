"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, DollarSign } from "lucide-react"
import { saveActivity, deleteActivity } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { SafeImage } from "@/components/safe-image"
import type { Day, Activity } from "@/lib/models"

interface ItineraryDayProps {
  day: Day
  itineraryId: string
}

export function ItineraryDay({ day, itineraryId }: ItineraryDayProps) {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: "",
    time: "",
    location: "",
    description: "",
    image: "",
    cost: 0,
  })
  const { toast } = useToast()

  const handleActivityInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingActivity) {
      setEditingActivity({ ...editingActivity, [name]: value })
    } else {
      setNewActivity({ ...newActivity, [name]: value })
    }
  }

  const handleActivityNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)
    if (editingActivity) {
      setEditingActivity({ ...editingActivity, [name]: numValue })
    } else {
      setNewActivity({ ...newActivity, [name]: numValue })
    }
  }

  const handleSaveActivity = async () => {
    try {
      const activityToSave = editingActivity || newActivity
      if (!activityToSave.name || !activityToSave.time || !activityToSave.location) {
        toast({
          title: "Error",
          description: "Activity name, time, and location are required.",
          variant: "destructive",
        })
        return
      }

      const saved = await saveActivity(itineraryId, day._id, activityToSave as Activity)
      if (saved) {
        toast({
          title: "Success",
          description: "Activity saved successfully!",
        })
        setIsActivityDialogOpen(false)
        setEditingActivity(null)
        setNewActivity({
          name: "",
          time: "",
          location: "",
          description: "",
          image: "",
          cost: 0,
        })
        // In a real app, you'd re-fetch the itinerary or update state
        window.location.reload() // Simple reload for demonstration
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
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        const success = await deleteActivity(itineraryId, day._id, activityId)
        if (success) {
          toast({
            title: "Success",
            description: "Activity deleted successfully!",
          })
          window.location.reload() // Simple reload for demonstration
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

  const openEditActivityDialog = (activity: Activity) => {
    setEditingActivity(activity)
    setIsActivityDialogOpen(true)
  }

  const handleActivityDialogClose = () => {
    setIsActivityDialogOpen(false)
    setEditingActivity(null)
    setNewActivity({
      name: "",
      time: "",
      location: "",
      description: "",
      image: "",
      cost: 0,
    })
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
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="icon" onClick={() => openEditActivityDialog(activity)}>
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

        <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4" onClick={() => setIsActivityDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[600px]"
            onEscapeKeyDown={handleActivityDialogClose}
            onPointerDownOutside={handleActivityDialogClose}
          >
            <DialogHeader>
              <DialogTitle>{editingActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="activity-name"
                  name="name"
                  value={editingActivity?.name || newActivity.name || ""}
                  onChange={handleActivityInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-time" className="text-right">
                  Time
                </Label>
                <Input
                  id="activity-time"
                  name="time"
                  value={editingActivity?.time || newActivity.time || ""}
                  onChange={handleActivityInputChange}
                  className="col-span-3"
                  placeholder="e.g., 9:00 AM"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="activity-location"
                  name="location"
                  value={editingActivity?.location || newActivity.location || ""}
                  onChange={handleActivityInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="activity-description"
                  name="description"
                  value={editingActivity?.description || newActivity.description || ""}
                  onChange={handleActivityInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="activity-image"
                  name="image"
                  value={editingActivity?.image || newActivity.image || ""}
                  onChange={handleActivityInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-cost" className="text-right">
                  Cost (₹)
                </Label>
                <Input
                  id="activity-cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={editingActivity?.cost || newActivity.cost || 0}
                  onChange={handleActivityNumberInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleActivityDialogClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveActivity}>{editingActivity ? "Save Changes" : "Add Activity"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
