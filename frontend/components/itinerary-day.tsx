"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ItineraryActivitiesManager } from "@/components/itinerary-activities-manager"
import type { ItineraryDay as ItineraryDayType } from "@/lib/models"
import { format } from "date-fns"

interface ItineraryDayProps {
  day: ItineraryDayType
  dayNumber: number
  itineraryId: string
  isAdmin: boolean
}

export function ItineraryDay({ day, dayNumber, itineraryId, isAdmin }: ItineraryDayProps) {
  const formattedDate = day.date ? format(new Date(day.date), "PPP") : "Date not set"

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            Day {dayNumber}: {day.title}
          </span>
          <span className="text-sm text-muted-foreground font-normal">{formattedDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-muted-foreground mb-4">{day.description}</p>
        <ItineraryActivitiesManager itineraryId={itineraryId} day={day} isAdmin={isAdmin} />
      </CardContent>
    </Card>
  )
}
