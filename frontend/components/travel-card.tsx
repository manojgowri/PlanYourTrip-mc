"use client"

import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPlaceholderImage } from "@/lib/image-utils"

interface TravelCardProps {
  id: string
  destination: string
  image?: string
  description: string
  startDate: string
  endDate: string
  status: "online" | "completed"
  season?: string
  locations?: string[]
}

export function TravelCard({
  id,
  destination,
  image,
  description,
  startDate,
  endDate,
  status,
  season,
  locations = [],
}: TravelCardProps) {
  const formattedStartDate = new Date(startDate).toLocaleDateString()
  const formattedEndDate = new Date(endDate).toLocaleDateString()

  // Use the image if provided, otherwise use a placeholder
  const imageUrl = image || getPlaceholderImage(400, 250)

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={`${destination} travel`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // If image fails to load, replace with placeholder
            e.currentTarget.src = getPlaceholderImage(400, 250)
          }}
        />
        <div className="absolute right-2 top-2">
          <Badge variant={status === "completed" ? "secondary" : "default"}>
            {status === "completed" ? "Completed" : "Upcoming"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold">{destination}</h3>
          {season && <Badge variant="outline">{season}</Badge>}
        </div>
        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {formattedStartDate} - {formattedEndDate}
          </span>
        </div>
        {locations.length > 0 && (
          <div className="mb-3 flex items-start gap-1">
            <MapPin className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{locations.join(", ")}</p>
          </div>
        )}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <Link
          href={`/itinerary/${encodeURIComponent(id)}`}
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:underline"
        >
          View Itinerary
        </Link>
      </CardContent>
    </Card>
  )
}
