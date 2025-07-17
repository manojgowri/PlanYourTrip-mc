"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Activity } from "@/lib/models"
import { format } from "date-fns"
import { DollarSign, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ItineraryDayProps {
  day: {
    dayNumber: number
    date?: string
    activities: Activity[]
  }
  itineraryId: string
}

export function ItineraryDay({ day, itineraryId }: ItineraryDayProps) {
  const [isOpen, setIsOpen] = useState(false)

  const totalDayExpense = day.activities.reduce((sum, activity) => sum + (activity.expense || 0), 0)

  const formattedDate = day.date ? format(new Date(day.date), "PPP") : "Date not set"
  const weekday = day.date ? format(new Date(day.date), "EEEE") : ""

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 p-4 transition-colors duration-200",
          isOpen ? "bg-secondary" : "bg-card",
        )}
      >
        <div className="flex items-center space-x-3">
          <CardTitle className="text-xl font-bold">{day.dayNumber === 0 ? "D0" : `Day ${day.dayNumber}`}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {formattedDate} {weekday && `(${weekday})`}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="mr-1 h-4 w-4" />
            <span>{totalDayExpense.toLocaleString()}</span>
          </div>
          <div className="text-sm text-muted-foreground">{day.activities.length} Activities</div>
          <ChevronDown
            className={cn("h-5 w-5 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </CardHeader>
      <CardContent className={cn("p-0", isOpen ? "block" : "hidden")}>
        <Accordion type="multiple" className="w-full">
          {day.activities.length === 0 ? (
            <p className="p-4 text-muted-foreground">No activities planned for this day.</p>
          ) : (
            day.activities.map((activity, index) => (
              <AccordionItem key={activity._id || index} value={`item-${activity._id || index}`}>
                <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{activity.name}</span>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground">
                  <p className="mb-2">{activity.description}</p>
                  {activity.location && <p className="text-sm">Location: {activity.location}</p>}
                  {activity.expense !== undefined && (
                    <p className="text-sm">Expense: ${activity.expense.toLocaleString()}</p>
                  )}
                  {activity.notes && <p className="text-sm">Notes: {activity.notes}</p>}
                  {activity.type && <p className="text-sm">Type: {activity.type}</p>}
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </CardContent>
    </Card>
  )
}
