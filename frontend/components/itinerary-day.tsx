"use client"

import { useState } from "react"
import { MapPin, Utensils, Compass, Plane, ChevronDown, ChevronUp, Hotel, Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatCurrency } from "@/lib/models"

type ActivityType = "food" | "activity" | "travel" | "accommodation" | "must-visit"

interface Activity {
  time: string
  title: string
  description: string
  type: ActivityType
  expense?: {
    amount: number
    currency: string
    category: string
  }
  image?: string
}

interface ItineraryDayProps {
  day: number
  date: string
  location: string
  activities: Activity[]
}

export function ItineraryDay({ day, date, location, activities }: ItineraryDayProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Calculate total expenses for the day
  const totalExpenses = activities.reduce((total, activity) => {
    if (activity.expense && activity.expense.amount) {
      return total + activity.expense.amount
    }
    return total
  }, 0)

  return (
    <Card>
      <CardHeader className="border-b bg-muted/50 pb-3 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">
              Day {day} - {location}
            </h3>
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span className="text-sm">{location}</span>
            </div>
            {totalExpenses > 0 && <div className="text-sm font-medium">{formatCurrency(totalExpenses, "INR")}</div>}
          </div>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="p-0">
          <div className="relative pl-8">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-emerald-200 dark:bg-emerald-800"></div>

            {activities.map((activity, index) => (
              <div key={index} className="relative py-4 pl-6 pr-4">
                <div className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-600 bg-background"></div>
                <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{activity.time}</span>
                  <div className="flex items-center gap-2 mt-1 sm:mt-0">
                    {getActivityIcon(activity.type)}
                    {activity.expense && activity.expense.amount > 0 && (
                      <span className="text-sm font-medium">
                        {formatCurrency(activity.expense.amount, activity.expense.currency)}
                      </span>
                    )}
                  </div>
                </div>
                <h4 className="font-medium">{activity.title}</h4>
                <p className="text-sm text-muted-foreground">{activity.description}</p>

                {activity.image && (
                  <div className="mt-2 h-24 w-full overflow-hidden rounded-md">
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "food":
      return <Utensils className="h-4 w-4 text-orange-500" />
    case "activity":
      return <Compass className="h-4 w-4 text-blue-500" />
    case "travel":
      return <Plane className="h-4 w-4 text-purple-500" />
    case "accommodation":
      return <Hotel className="h-4 w-4 text-red-500" />
    case "must-visit":
      return <Star className="h-4 w-4 text-amber-500" />
    default:
      return null
  }
}
