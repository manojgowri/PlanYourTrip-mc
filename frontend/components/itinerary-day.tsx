"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  DollarSign,
  Camera,
  Utensils,
  Car,
  Plane,
  Hotel,
  Star,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Activity } from "@/lib/models"

interface ItineraryDayProps {
  day: number
  date: string
  location: string
  activities: Activity[]
}

const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
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
      return <Star className="h-4 w-4" />
  }
}

const getActivityColor = (type: string) => {
  switch (type.toLowerCase()) {
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

const formatTime = (time: string) => {
  if (!time) return ""
  try {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  } catch {
    return time
  }
}

const getWeekday = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long" })
  } catch {
    return ""
  }
}

export function ItineraryDay({ day, date, location, activities }: ItineraryDayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalExpenses = activities.reduce((sum, activity) => {
    return sum + (activity.expense?.amount || 0)
  }, 0)

  const weekday = getWeekday(date)
  const dayLabel = day === 0 ? "D0" : `Day ${day}`

  return (
    <Card className="overflow-hidden">
      <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    day === 0
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                  }`}
                >
                  {dayLabel}
                </div>
                {day === 0 && <span className="text-xs text-muted-foreground mt-1">Departure</span>}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{date}</h3>
                  {weekday && (
                    <Badge variant="outline" className="text-xs">
                      {weekday}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {activities.length} {activities.length === 1 ? "Activity" : "Activities"}
                </div>
                {totalExpenses > 0 && (
                  <div className="text-sm font-medium text-emerald-600">₹{totalExpenses.toLocaleString()}</div>
                )}
              </div>
              <Button variant="ghost" size="sm">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>

      {isExpanded && (
        <CardContent className="border-t bg-gray-50/50 dark:bg-gray-900/20 p-4">
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border bg-white dark:bg-gray-800 p-3"
                >
                  <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {activity.time && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(activity.time)}</span>
                            </div>
                          )}
                          {activity.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {activity.expense && activity.expense.amount > 0 && (
                        <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                          <DollarSign className="h-3 w-3" />
                          <span>₹{activity.expense.amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No activities planned for this day</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
