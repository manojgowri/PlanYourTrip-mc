"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, IndianRupee } from "lucide-react"
import type { Activity } from "@/lib/models"
import { getPlaceholderImage } from "@/lib/image-utils"

interface ItineraryDayProps {
  day: number
  date: string
  location: string
  activities: Activity[]
}

export function ItineraryDay({ day, date, location, activities }: ItineraryDayProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

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

  // Calculate total expenses for the day
  const totalExpenses = activities.reduce((total, activity) => {
    if (activity.expense && activity.expense.amount) {
      return total + activity.expense.amount
    }
    return total
  }, 0)

  return (
    <div className="rounded-lg border shadow-sm">
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={toggleExpand}
        role="button"
        tabIndex={0}
      >
        <div>
          <h3 className="text-lg font-medium">
            Day {day}: {location}
          </h3>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-4">
          {totalExpenses > 0 && (
            <div className="flex items-center gap-1 text-sm font-medium">
              <IndianRupee className="h-3.5 w-3.5" />
              <span>{totalExpenses.toFixed(2)}</span>
            </div>
          )}
          <button className="rounded-full p-1 hover:bg-gray-100">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t px-4 py-3">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="w-16 shrink-0 text-center">
                    <span className="text-sm font-medium">{activity.time}</span>
                  </div>
                  <div className="flex-1 rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium">{activity.title}</h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getActivityTypeColor(activity.type)}`}
                      >
                        {activity.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>

                    {activity.image && (
                      <div className="mt-3 overflow-hidden rounded-md">
                        <img
                          src={activity.image || getPlaceholderImage(400, 160)}
                          alt={activity.title}
                          className="h-40 w-full object-cover"
                          onError={(e) => {
                            // If image fails to load, replace with placeholder
                            e.currentTarget.src = getPlaceholderImage(400, 160)
                          }}
                        />
                      </div>
                    )}

                    {activity.expense && activity.expense.amount > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Cost: </span>
                        <span className="flex items-center gap-1 inline-flex">
                          <IndianRupee className="h-3 w-3" />
                          {activity.expense.amount.toFixed(2)}
                        </span>
                        {activity.expense.category && (
                          <span className="ml-2 text-xs text-muted-foreground">({activity.expense.category})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-2 text-center text-sm text-muted-foreground">No activities planned for this day yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
