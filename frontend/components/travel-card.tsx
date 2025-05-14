"use client"

import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  days?: number
  rating?: number
  reviewCount?: number
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
  days,
  rating,
  reviewCount,
}: TravelCardProps) {
  // Use a placeholder image if none is provided
  const imageUrl =
    image ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' fontFamily='Arial' fontSize='24' fill='%23999' textAnchor='middle' dominantBaseline='middle'%3EImage Placeholder%3C/text%3E%3C/svg%3E"

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={`${destination} travel`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // If image fails to load, replace with placeholder
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' fontFamily='Arial' fontSize='24' fill='%23999' textAnchor='middle' dominantBaseline='middle'%3EImage Placeholder%3C/text%3E%3C/svg%3E"
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
            {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
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
