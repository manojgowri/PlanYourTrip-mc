"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, DollarSign, Star } from "lucide-react"
import type { Itinerary } from "@/lib/models"
import { calculateDuration, getTravelRecommendation } from "@/lib/utils"
import { SafeImage } from "./safe-image"

interface TravelCardProps {
  itinerary: Itinerary
}

export function TravelCard({ itinerary }: TravelCardProps) {
  const duration = calculateDuration(itinerary.startDate, itinerary.endDate)
  const perPersonCost =
    itinerary.totalBudget && itinerary.travellersCount && itinerary.travellersCount > 0
      ? (itinerary.totalBudget / itinerary.travellersCount).toLocaleString()
      : "N/A"
  const travelRecommendation = getTravelRecommendation(itinerary.travellersCount)

  return (
    <Link href={`/itinerary/${itinerary._id}`}>
      <Card className="w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="relative h-48 w-full">
          <SafeImage
            src={itinerary.image || "/placeholder.svg?height=200&width=300"}
            alt={`Image of ${itinerary.destination}`}
            className="object-cover"
            fill
          />
          <Badge
            className="absolute right-3 top-3 px-3 py-1 text-sm font-semibold"
            style={{
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            {itinerary.season}
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary-foreground">{itinerary.destination}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>{duration}</span>
          </div>
          {itinerary.travellersCount !== undefined && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>{itinerary.travellersCount} Travellers</span>
            </div>
          )}
          {itinerary.totalBudget !== undefined && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Total Budget: ${itinerary.totalBudget.toLocaleString()}</span>
            </div>
          )}
          {itinerary.totalBudget !== undefined &&
            itinerary.travellersCount !== undefined &&
            itinerary.travellersCount > 0 && (
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Per Person: ${perPersonCost}</span>
              </div>
            )}
          {travelRecommendation && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="mr-2 h-4 w-4" />
              <span>Recommended: {travelRecommendation}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
            {itinerary.category}
          </Badge>
          {itinerary.reviewsCount !== undefined && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{itinerary.reviewsCount} Reviews</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
