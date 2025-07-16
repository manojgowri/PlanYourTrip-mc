"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MapPin, Clock, DollarSign, Camera, Utensils, Car, Plane, Hotel } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SafeImage } from "./safe-image"
import type { Activity } from "@/lib/models"

interface ItineraryDayProps {
  day: number
  date: string
  location: string
  activities: Activity[]
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "food":
      return <Utensils className="h-4 w-4" />
    case "transport":
      return <Car className="h-4 w-4" />
    case "flight":
      return <Plane className="h-4 w-4" />
    case "accommodation":
      return <Hotel className="h-4 w-4" />
    case "sightseeing":
      return <Camera className="h-4 w-4" />
    default:
      return <MapPin className="h-4 w-4" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "food":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
    case "transport":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    case "flight":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    case "accommodation":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    case "sightseeing":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}

export function ItineraryDay({ day, date, location, activities }: ItineraryDayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalExpenses = activities.reduce((sum, activity) => sum + (activity.expense || 0), 0)
  const activityCount = activities.length

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                <span className="text-sm font-bold">{day === 0 ? "D0" : `D${day}`}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{day === 0 ? "Departure Day" : `Day ${day}`}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(date)}</span>
                  {location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {activityCount} {activityCount === 1 ? "activity" : "activities"}
                </span>
              </div>
              {totalExpenses > 0 && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{totalExpenses.toLocaleString()}</span>
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex-shrink-0">
                    {activity.image && (
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <SafeImage src={activity.image} alt={activity.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getActivityColor(activity.type)}>
                          <div className="flex items-center gap-1">
                            {getActivityIcon(activity.type)}
                            <span className="capitalize">{activity.type}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {activity.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{activity.time}</span>
                        </div>
                      )}
                      {activity.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                      {activity.expense && activity.expense > 0 && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>₹{activity.expense.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No activities planned for this day yet.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
