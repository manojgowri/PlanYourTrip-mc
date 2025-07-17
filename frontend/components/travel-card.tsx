import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Star } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import type { Itinerary } from "@/lib/models"

interface TravelCardProps {
  itinerary: Itinerary
}

export function TravelCard({ itinerary }: TravelCardProps) {
  const {
    _id,
    destination,
    image,
    description,
    startDate,
    endDate,
    status,
    season,
    locations,
    days,
    metadata,
    totalBudget,
    travellersCount,
    category,
    rating,
    reviewsCount,
  } = itinerary

  return (
    <Link href={`/itinerary/${_id}`} className="block">
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 w-full">
          <SafeImage
            src={image || "/placeholder.svg?height=200&width=300"}
            alt={destination}
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-2 right-2" variant={status === "completed" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-bold">{destination}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {startDate} - {endDate} ({days.length} days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{travellersCount} Travellers</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{locations.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>
              {rating?.toFixed(1)} ({reviewsCount} reviews)
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{category}</Badge>
            {season && <Badge variant="outline">{season}</Badge>}
            {totalBudget && <Badge variant="outline">Budget: ₹{totalBudget.toLocaleString()}</Badge>}
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <span className="text-primary font-semibold">View Details &rarr;</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
