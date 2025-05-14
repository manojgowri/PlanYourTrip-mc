"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivityFormModal } from "@/components/activity-form-modal"
import { Trash2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { generateId } from "@/lib/data"
import type { Activity, ItineraryDay } from "@/lib/models"

interface ItineraryActivitiesManagerProps {
  itineraryId: string
  days: ItineraryDay[]
  onUpdate: (days: ItineraryDay[]) => void
}

export function ItineraryActivitiesManager({ itineraryId, days, onUpdate }: ItineraryActivitiesManagerProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(days.length > 0 ? 0 : null)
  const [newDayOpen, setNewDayOpen] = useState(false)
  const [newDayNumber, setNewDayNumber] = useState("")
  const [newDayDate, setNewDayDate] = useState("")
  const [newDayLocation, setNewDayLocation] = useState("")

  const selectedDay = selectedDayIndex !== null ? days[selectedDayIndex] : null

  const handleAddDay = () => {
    if (!newDayNumber || !newDayDate) return

    const newDay: ItineraryDay = {
      id: generateId(),
      day: Number.parseInt(newDayNumber),
      date: newDayDate,
      location: newDayLocation,
      activities: [],
    }

    const updatedDays = [...days, newDay].sort((a, b) => a.day - b.day)
    onUpdate(updatedDays)
    setSelectedDayIndex(updatedDays.findIndex((d) => d.id === newDay.id))
    setNewDayOpen(false)
    resetNewDayForm()
  }

  const resetNewDayForm = () => {
    setNewDayNumber("")
    setNewDayDate("")
    setNewDayLocation("")
  }

  const handleDeleteDay = (dayIndex: number) => {
    if (!confirm("Are you sure you want to delete this day and all its activities?")) return

    const updatedDays = [...days]
    updatedDays.splice(dayIndex, 1)
    onUpdate(updatedDays)

    if (selectedDayIndex === dayIndex) {
      setSelectedDayIndex(updatedDays.length > 0 ? 0 : null)
    } else if (selectedDayIndex !== null && selectedDayIndex > dayIndex) {
      setSelectedDayIndex(selectedDayIndex - 1)
    }
  }

  const handleAddActivity = (activity: Partial<Activity>) => {
    if (selectedDayIndex === null) return

    const newActivity: Activity = {
      id: generateId(),
      time: activity.time || "",
      title: activity.title || "",
      description: activity.description || "",
      type: activity.type || "activity",
      expense: activity.expense,
      image: activity.image,
    }

    const updatedDays = [...days]
    updatedDays[selectedDayIndex].activities.push(newActivity)
    onUpdate(updatedDays)
  }

  const handleEditActivity = (activityIndex: number, updatedActivity: Partial<Activity>) => {
    if (selectedDayIndex === null) return

    const updatedDays = [...days]
    updatedDays[selectedDayIndex].activities[activityIndex] = {
      ...updatedDays[selectedDayIndex].activities[activityIndex],
      ...updatedActivity,
    }
    onUpdate(updatedDays)
  }

  const handleDeleteActivity = (activityIndex: number) => {
    if (selectedDayIndex === null) return
    if (!confirm("Are you sure you want to delete this activity?")) return

    const updatedDays = [...days]
    updatedDays[selectedDayIndex].activities.splice(activityIndex, 1)
    onUpdate(updatedDays)
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "food":
        return "bg-amber-100 text-amber-800"
      case "activity":
        return "bg-blue-100 text-blue-800"
      case "travel":
        return "bg-purple-100 text-purple-800"
      case "accommodation":
        return "bg-green-100 text-green-800"
      case "must-visit":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Manage Itinerary Days & Activities</h2>
        <Dialog open={newDayOpen} onOpenChange={setNewDayOpen}>
          <DialogTrigger asChild>
            <Button>Add New Day</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Day</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddDay()
              }}
              className="space-y-4 mt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="day-number">Day Number *</Label>
                <Input
                  id="day-number"
                  type="number"
                  min="1"
                  value={newDayNumber}
                  onChange={(e) => setNewDayNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="day-date">Date *</Label>
                <Input
                  id="day-date"
                  type="date"
                  value={newDayDate}
                  onChange={(e) => setNewDayDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="day-location">Location</Label>
                <Input
                  id="day-location"
                  value={newDayLocation}
                  onChange={(e) => setNewDayLocation(e.target.value)}
                  placeholder="e.g. Paris, Rome, etc."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setNewDayOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Day</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {days.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No days have been added to this itinerary yet.</p>
            <p className="text-muted-foreground">Click "Add New Day" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {days.map((day, index) => (
                  <div
                    key={day.id}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      selectedDayIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedDayIndex(index)}
                  >
                    <div>
                      <div className="font-medium">Day {day.day}</div>
                      <div className="text-sm opacity-80">{new Date(day.date).toLocaleDateString()}</div>
                      {day.location && <div className="text-sm opacity-80">{day.location}</div>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteDay(index)
                      }}
                      className={
                        selectedDayIndex === index ? "hover:bg-primary-foreground/20" : "hover:bg-muted-foreground/20"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{selectedDay ? `Activities for Day ${selectedDay.day}` : "Activities"}</CardTitle>
              {selectedDay && <ActivityFormModal onSave={handleAddActivity} buttonText="Add Activity" />}
            </CardHeader>
            <CardContent>
              {!selectedDay ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">Select a day to manage its activities</p>
                </div>
              ) : selectedDay.activities.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">No activities have been added for this day yet.</p>
                  <p className="text-muted-foreground">Click "Add Activity" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDay.activities.map((activity, index) => (
                    <Card key={activity.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{activity.title}</h3>
                              <Badge className={getActivityTypeColor(activity.type)}>{activity.type}</Badge>
                            </div>

                            {activity.time && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{activity.time}</span>
                              </div>
                            )}

                            {activity.description && (
                              <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                            )}

                            {activity.expense && activity.expense.amount > 0 && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Cost: </span>
                                <span>₹{activity.expense.amount.toFixed(2)}</span>
                                {activity.expense.category && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({activity.expense.category})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <ActivityFormModal
                              activity={activity}
                              onSave={(updatedActivity) => handleEditActivity(index, updatedActivity)}
                              buttonVariant="ghost"
                              buttonText=""
                              isEdit
                            />
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {activity.image && (
                          <div className="mt-3 overflow-hidden rounded-md">
                            <img
                              src={activity.image || "/placeholder.svg"}
                              alt={activity.title}
                              className="h-40 w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
