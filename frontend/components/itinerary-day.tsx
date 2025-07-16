"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Clock, CreditCard, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SafeImage } from "@/components/safe-image"
import type { Activity } from "@/lib/models"

interface ItineraryDayProps {
  day: number
  date: string
  location: string
  activities: Activity[]
}

export function ItineraryDay({ day, date, location, activities }: ItineraryDayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate total expenses for the day
  const dayExpenses = activities.reduce((total, activity) => {
    return total + (activity.expense?.amount || 0)
  }, 0)

  // Get weekday name
  const getWeekdayName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }

  const weekday = getWeekdayName(date)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "food":
        return "🍽️"
      case "activity":
        return "🎯"
      case "travel":
        return "🚗"
      case "accommodation":
        return "🏨"
      case "must-visit":
        return "⭐"
      default:
        return "📍"
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "food":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
      case "activity":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
      case "travel":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
      case "accommodation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
      case "must-visit":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Day Header - Always Visible */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-emerald-600">{day === 0 ? "D0" : `Day ${day}`}</div>
              <div className="text-xs text-muted-foreground">{weekday}</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{location}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{new Date(date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{activities.length} activities</div>
              {dayExpenses > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CreditCard className="h-3 w-3" />
                  <span>₹{dayExpenses.toLocaleString()}</span>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Activities - Expandable */}
        {isExpanded && (
          <div className="border-t bg-muted/20">
            <div className="p-4 space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 p-4 bg-background rounded-lg border">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{activity.title}</h4>
                            <Badge variant="outline" className={getActivityColor(activity.type)}>
                              {activity.type}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{activity.time}</span>
                            </div>
                            {activity.expense && (
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                <span>₹{activity.expense.amount.toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-muted-foreground">{activity.description}</p>
                        </div>

                        {activity.image && (
                          <div className="flex-shrink-0">
                            <SafeImage
                              src={activity.image}
                              alt={activity.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activities planned for this day yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
