"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivityFormModal } from "@/components/activity-form-modal"
import { ItineraryActivitiesManager } from "@/components/itinerary-activities-manager"
import type { Day, Activity } from "@/lib/models"
import { Plus } from "lucide-react"

interface ItineraryDayProps {
  day: Day
  dayNumber: number
  itineraryId: string
  isAdmin: boolean
}

export function ItineraryDay({ day, dayNumber, itineraryId, isAdmin }: ItineraryDayProps) {
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const handleAddActivityClick = () => {
    setEditingActivity(null)
    setIsActivityModalOpen(true)
  }

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity)
    setIsActivityModalOpen(true)
  }

  const handleActivityModalClose = () => {
    setIsActivityModalOpen(false)
    setEditingActivity(null)
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          Day {dayNumber}: {day.date}
        </CardTitle>
        {isAdmin && (
          <Button size="sm" onClick={handleAddActivityClick}>
            <Plus className="mr-2 h-4 w-4" /> Add Activity
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ItineraryActivitiesManager
          itineraryId={itineraryId}
          dayIndex={dayNumber - 1} // Convert day number to 0-based index
          initialActivities={day.activities}
          isAdmin={isAdmin}
          onEditActivity={handleEditActivity}
        />
      </CardContent>

      <ActivityFormModal
        isOpen={isActivityModalOpen}
        onClose={handleActivityModalClose}
        itineraryId={itineraryId}
        dayIndex={dayNumber - 1}
        initialActivity={editingActivity}
      />
    </Card>
  )
}
