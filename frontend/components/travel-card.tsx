"use client"

import Link from "next/link"
import { Calendar, MapPin, CreditCard, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"
import { calculateTotalExpenses } from "@/lib/data"
import type { Itinerary } from "@/lib/models"

interface TravelCardProps {
  id: string
  destination: string
  image?: string
  description: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  status: "online" | "completed"
  season?: string
  locations?: string[]
  days?: number
  rating?: number
  reviewCount?: number
  metadata?: Itinerary["metadata"]
  itinerary: Itinerary
  travellersCount?: number
}

export function TravelCard({
  id,
  destination,
  image,
  description,
  startDate,
  endDate,
  startTime,
  endTime,
  status,
  season,
  locations = [],
  itinerary,
  travellersCount = 1,
}: TravelCardProps) {
  // Use a placeholder image if none is provided
  const imageUrl =
    image ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' fontFamily='Arial' fontSize='24' fill='%23999' textAnchor='middle' dominantBaseline='middle'%3EImage Placeholder%3C/text%3E%3C/svg%3E"

  // Calculate total expenses for this itinerary dynamically
  const { amount: totalExpenses } = calculateTotalExpenses(itinerary)
  const perPersonCost = travellersCount > 1 ? totalExpenses / travellersCount : totalExpenses

  // Calculate trip duration
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const nights = diffDays > 0 ? diffDays - 1 : 0
    return { days: diffDays, nights }
  }

  const duration = calculateDuration(startDate, endDate)

  // Get season badge color for dark mode
  const getSeasonBadgeClass = (season: string) => {
    switch (season?.toLowerCase()) {
      case "spring":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
      case "summer":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
      case "fall":
      case "autumn":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
      case "winter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <SafeImage
          src={imageUrl}
          alt={`${destination} travel`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <Badge variant={status === "completed" ? "secondary" : "default"}>
            {status === "completed" ? "Completed" : "Upcoming"}
          </Badge>
          {season && (
            <Badge variant="outline" className={getSeasonBadgeClass(season)}>
              {season}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-3">
        <div className="mb-1">
          <h3 className="text-lg font-bold">{destination}</h3>
        </div>

        {/* Trip Duration */}
        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {duration.days} Days / {duration.nights} Nights
          </span>
        </div>

        {locations.length > 0 && (
          <div className="mb-2 flex items-start gap-1">
            <MapPin className="mt-0.5 h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{locations.join(", ")}</p>
          </div>
        )}
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{description}</p>

        {/* Display total and per-person expenses */}
        <div className="mb-3 space-y-1">
          <div className="flex items-center gap-1 text-xs font-medium">
            <CreditCard className="h-3 w-3 text-emerald-600" />
            <span>Total: ₹{totalExpenses.toLocaleString()}</span>
          </div>
          {travellersCount > 1 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3 text-emerald-600" />
              <span>
                Per Person: ₹{perPersonCost.toLocaleString()} ({travellersCount} travellers)
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/itinerary/${encodeURIComponent(id)}`}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 w-full"
        >
          View Itinerary
        </Link>
      </CardContent>
    </Card>
  )
}
