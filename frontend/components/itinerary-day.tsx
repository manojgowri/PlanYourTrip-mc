"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, DollarSign, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "./safe-image"
import type { ItineraryDay as ItineraryDayType } from "@/lib/models"

interface ItineraryDayProps {
  day: ItineraryDayType
  itineraryId: string
}

export function ItineraryDay({ day }: ItineraryDayProps) {
  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="bg-primary-foreground/5 p-4 rounded-t-lg">
        <CardTitle className="text-xl font-bold text-primary-foreground">
          Day {day.dayNumber}: {day.location}
          <span className="block text-sm font-normal text-muted-foreground">{formattedDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {day.activities.length > 0 ? (
          <div className="space-y-6">
            {day.activities.map((activity, index) => (
              <div key={activity._id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs text-muted-foreground mt-1">{activity.time}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary-foreground">{activity.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                    {activity.location && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {activity.location}
                      </Badge>
                    )}
                    {activity.type && (
                      <Badge variant="secondary" className="capitalize">
                        {activity.type}
                      </Badge>
                    )}
                    {activity.mustVisit && <Badge className="bg-yellow-500 text-white">Must Visit</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>

                  {activity.expense && activity.expense.amount > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>
                        Expense: {activity.expense.currency} {activity.expense.amount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {activity.image && (
                    <div className="mt-3 relative w-full h-48 rounded-md overflow-hidden">
                      <SafeImage src={activity.image} alt={activity.name} className="object-cover" fill />
                    </div>
                  )}

                  {activity.notes && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4 flex-shrink-0" />
                      <p>{activity.notes}</p>
                    </div>
                  )}
                </div>
                {index < day.activities.length - 1 && (
                  <Separator orientation="vertical" className="h-full hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No activities planned for this day yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
