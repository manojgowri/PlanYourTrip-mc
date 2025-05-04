import Link from "next/link"
import { Calendar, Star } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TravelCardProps {
  id: string
  destination: string
  image: string
  description: string
  startDate: string
  endDate: string
  locations: string[]
  status: "online" | "completed"
  season: string
  days: number
  rating: number
  reviewCount: number
  expenses?: {
    amount: number
    currency: string
  }
}

export function TravelCard({
  id,
  destination,
  image,
  description,
  startDate,
  endDate,
  locations,
  status,
  season,
  days,
  rating,
  reviewCount,
  expenses,
}: TravelCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      {/* Status Badge */}
      <div className="absolute right-3 top-3 z-10">
        <Badge
          className={`${
            status === "online" ? "bg-blue-500 hover:bg-blue-600" : "bg-emerald-500 hover:bg-emerald-600"
          } text-white`}
        >
          {status === "online" ? "Online" : "Completed"}
        </Badge>
      </div>

      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={`${destination} travel image`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{destination}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
          </div>
          <Badge variant="outline" className="bg-amber-50">
            {season}
          </Badge>
        </div>

        <p className="mb-3 text-sm text-muted-foreground">{description}</p>

        {expenses && expenses.amount > 0 && (
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">Total Expenses:</span>
            <Badge variant="outline" className="bg-green-50">
              {expenses.currency === "INR" ? "₹" : "$"}
              {expenses.amount.toFixed(2)}
            </Badge>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {locations.map((location, index) => (
            <Badge key={index} variant="outline" className="bg-emerald-50">
              {location}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 border-t p-4">
        <div className="flex w-full items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
          {status === "completed" && (
            <Badge variant="outline" className="bg-slate-50">
              {days} days
            </Badge>
          )}
        </div>
        <Link
          href={`/itinerary/${id}`}
          className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          View Itinerary
        </Link>
      </CardFooter>
    </Card>
  )
}
