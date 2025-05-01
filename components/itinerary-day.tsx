import { MapPin, Utensils, Compass, Plane } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type ActivityType = "food" | "activity" | "travel" | "accommodation"

interface Activity {
  time: string
  title: string
  description: string
  type: ActivityType
}

interface ItineraryDayProps {
  day: number
  date: string
  location: string
  activities: Activity[]
}

export function ItineraryDay({ day, date, location, activities }: ItineraryDayProps) {
  return (
    <Card>
      <CardHeader className="border-b bg-muted/50 pb-3">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold">
              Day {day} - {location}
            </h3>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative pl-8">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-emerald-200"></div>

          {activities.map((activity, index) => (
            <div key={index} className="relative py-4 pl-6 pr-4">
              <div className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-600 bg-white"></div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-700">{activity.time}</span>
                {getActivityIcon(activity.type)}
              </div>
              <h4 className="font-medium">{activity.title}</h4>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
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
      return <MapPin className="h-4 w-4 text-red-500" />
    default:
      return null
  }
}
